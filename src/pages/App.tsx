import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import Erc20 from '../abis/Erc20'
import Factory from '../abis/Factory'
import Vesting from '../abis/Vesting'
import Api from '../api'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useMulticall } from '../hooks/useContract'
import { useAppDispatch } from '../state/hooks'
import { getAddressActive, IPoolsData, updatePoolsData } from '../state/pools/reducer'
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
      margin-left: 320px;
      margin-top: 85px;
      padding: 32px 60px 60px 30px;
      width: calc(100% - 320px);
      display: block;
      flex-direction: unset;
      align-items: unset;
      background-image: linear-gradient(180deg, #01152d 31.72%, #011024 100%);
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
      left: 320px;
      display: flex;
      justify-content: flex-end;
      background-color: ${({ theme }) => theme.bgPrimary};
      width: calc(100% - 320px);
      padding: 25px 60px;
    `}
`
const FooterWrapper = styled.div`
  position: fixed;
  height: 40px;
  bottom: 0;
  left: 320px;
  right: 0;
  width: calc(100% - 320px);
  z-index: 2;
  background-color: #011024;
`
const FooterContent = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.white};
  text-align: right;
  margin-right: 60px;
  margin-top: 10px;
  & > span {
    font-weight: 700;
  }
`
export default function App() {
  const [erc20Balance, setErc20Balance] = useState<number>(0)
  const { account } = useActiveWeb3React()
  const [pools, setPools] = useState<any>([])
  const [poolsResult, setPoolsResult] = useState<Array<any>>([])

  const dispatch = useAppDispatch()
  const location = useLocation()
  const [isNotLandingPage, setIsNotLandingPage] = useState<boolean>(true)
  const contract = useMulticall() || null

  const checkAndGetPool = useCallback(
    async (pool: string) => {
      if (!account) {
        return
      }

      const vestingInstance = new ethers.Contract(pool, Vesting, contract.provider)
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
        erc20Balance: erc20Balance || 0,
      }
    },
    [account, contract?.provider, erc20Balance]
  )

  useEffect(() => {
    setIsNotLandingPage(location.pathname !== '/')
  }, [location])

  useEffect(() => {
    if (!account) {
      return
    }
    const factoryInstance = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS || '',
      Factory,
      contract.provider
    )
    const url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS}/pools`

    ;(async () => {
      try {
        const poolsAddresses = await factoryInstance.getPools()
        const poolResult = await Promise.all(
          poolsAddresses.map(async (address: string) => {
            return await checkAndGetPool(address)
          })
        )
        const pools: any[] = await Api.get(url)
        const poolsNew = pools.reduce((total, pool) => {
          const item = {
            ...pool,
            roles: [...pool.managers[0][1]],
          }
          return [...total, item]
        }, [])
        setPools(poolsNew)
        setPoolsResult(poolResult)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [account, contract?.provider, checkAndGetPool])

  useEffect(() => {
    if (!poolsResult.length || !pools.length) {
      return
    }

    const poolsClone = [...pools]
    let availablePools = [...poolsResult]

    if (availablePools.length !== 0) {
      availablePools = availablePools.map((pool: IPoolsData) => {
        const data = poolsClone.find((x: any) => x.address === pool.address)
        pool = {
          ...pool,
          name: data.name,
          start: data.start * 1000,
          end: data.end * 1000,
          roles: data.roles,
        }

        return pool
      })

      dispatch(updatePoolsData(availablePools))
      dispatch(getAddressActive(''))
    }
  }, [pools, poolsResult, dispatch])

  useEffect(() => {
    if (!account) {
      return
    }
    const Erc20Instance = new ethers.Contract(process.env.REACT_APP_TOKEN_ADDRESS || '', Erc20, contract.provider)
    ;(async () => {
      const balance = await Erc20Instance.balanceOf(account)
      setErc20Balance(ethBalance(balance))
    })()
  }, [account, contract?.provider])

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
