import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import Erc20 from '../abis/Erc20'
import Factory from '../abis/Factory'
import Vesting from '../abis/vesting.json'
import Api from '../api'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useAppDispatch } from '../state/hooks'
import { IPoolsData, updateErc20Balance, updatePoolsData } from '../state/pools/reducer'
import { ethBalance } from '../utils'
import RouterPage from './router'
const AppWrapper = styled.div<{ bgImage?: string }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: ${({ theme }) => theme.bg5};
  background-image: ${(props) =>
    props.bgImage
      ? `linear-gradient(
                    0deg,
                    rgba(10, 37, 27, 0.6),
                    rgba(10, 37, 27, 0.6)
            ),url(${props.bgImage})`
      : 'none'};
`
const BodyWrapper = styled.div<{ bodyDashBoard?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 84px 16px 0 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 56px 16px 8px 16px;
  `};
  ${({ bodyDashBoard }) =>
    bodyDashBoard &&
    css`
      margin-top: 85px;
      padding: 32px 60px 60px 60px;
      display: block;
      flex-direction: unset;
      align-items: unset;
      background-color: #00142d;
    `}
`
const HeaderWrapper = styled.div<{ headerDashBoard?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
  ${({ headerDashBoard }) =>
    headerDashBoard &&
    css`
      display: flex;
      justify-content: flex-end;
      padding: 25px 60px;
    `}
`
const FooterWrapper = styled.div`
  position: fixed;
  height: 50px;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FooterContent = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.white};
  text-align: right;
  margin: 20px 40px 40px 30px;
  & > span {
    font-weight: 700;
  }
`
export default function App() {
  const { account } = useActiveWeb3React()
  const [pools, setPools] = useState<any>([])
  const [poolsResult, setPoolsResult] = useState<Array<any>>([])

  const dispatch = useAppDispatch()
  const location = useLocation()
  const [isNotLandingPage, setIsNotLandingPage] = useState<boolean>(true)

  const checkAndGetPool = useCallback(
    async (pool: string) => {
      if (!account) {
        return
      }

      const provider: any = await detectEthereumProvider()
      const web3Provider = new providers.Web3Provider(provider)

      const vestingInstance = new ethers.Contract(pool, Vesting, web3Provider.getSigner())
      const grant = await vestingInstance.getTokenGrant(account)
      const amount = ethBalance(grant.amount)
      const claimable = await vestingInstance.calculateGrantClaim(account)

      if (amount) {
        const blacklist = await vestingInstance.blacklist(account).catch((e: string) => {
          console.error(e)
        })

        console.log(blacklist)
      }

      return {
        statusClaim: 1,
        address: pool,
        amount,
        claimed: ethBalance(grant.totalClaimed),
        claimable: ethBalance(claimable),
        remain: amount - ethBalance(grant.totalClaimed) - ethBalance(claimable),
      }
    },
    [account]
  )

  useEffect(() => {
    setIsNotLandingPage(location.pathname !== '/')
  }, [location])

  useEffect(() => {
    if (!account) {
      return
    }

    ;(async () => {
      try {
        const provider: any = await detectEthereumProvider()
        const web3Provider = new providers.Web3Provider(provider)

        const factoryInstance = new ethers.Contract(
          process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS || '',
          Factory,
          web3Provider
        )
        const url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS}/pools`
        const poolsAddresses = await factoryInstance.getPools()
        const poolResult = await Promise.all(
          poolsAddresses.map(async (address: string) => {
            return await checkAndGetPool(address)
          })
        )
        const pools: any[] = await Api.get(url)

        const poolsNew = pools.reduce((total, pool, index) => {
          const poolRoles = pool.managers.filter((manager: any) => {
            return manager[0] === account
          })

          const managersAddressArray = pool.managers
            .filter((manager: any) => {
              return manager[1].includes('OPERATOR')
            })
            .reduce((total: string[], item: any) => {
              total.push(item[0])
              return total
            }, [])

          const item = {
            ...pool,
            roles: poolRoles && poolRoles.length ? poolRoles[0][1] : [],
            managersAddressArray,
          }
          return [...total, item]
        }, [])
        setPools(poolsNew)
        setPoolsResult(poolResult)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [account, checkAndGetPool])

  useEffect(() => {
    if (!poolsResult.length || !pools.length) {
      return
    }

    const poolsClone = [...pools]
    let availablePools = [...poolsResult]

    if (availablePools.length !== 0) {
      availablePools = availablePools
        .map((pool: IPoolsData) => {
          const data = poolsClone.find((x: any) => x.address === pool.address)
          pool = {
            ...pool,
            name: data?.name || '',
            start: data?.start * 1000 || null,
            end: data?.end * 1000 || null,
            roles: data?.roles || [],
            managersAddress: data?.managersAddressArray || [],
          }

          return pool
        })
        .filter((pool) => pool.name && pool.start && pool.end)

      dispatch(updatePoolsData(availablePools))
    }
  }, [pools, poolsResult, dispatch])

  useEffect(() => {
    if (!account) {
      return
    }

    ;(async () => {
      const provider: any = await detectEthereumProvider()
      const web3Provider = new providers.Web3Provider(provider)

      const Erc20Instance = new ethers.Contract(
        process.env.REACT_APP_TOKEN_ADDRESS || '',
        Erc20,
        web3Provider.getSigner()
      )
      const balance = await Erc20Instance.balanceOf(account)
      dispatch(updateErc20Balance(ethBalance(balance)))
    })()
  }, [account, dispatch])

  return (
    <ErrorBoundary>
      <Web3ReactManager>
        <AppWrapper>
          <HeaderWrapper headerDashBoard={isNotLandingPage}>
            <Header />
          </HeaderWrapper>
          <BodyWrapper bodyDashBoard={isNotLandingPage}>
            <Popups />
            <RouterPage />
          </BodyWrapper>
          {isNotLandingPage && (
            <FooterWrapper>
              <FooterContent>Copyright ©2022 Dandelion Labs JSC.</FooterContent>
              <FooterContent>
                <span>Blockchain:</span> Ethereum Testnet Rinkeby
              </FooterContent>
            </FooterWrapper>
          )}
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
