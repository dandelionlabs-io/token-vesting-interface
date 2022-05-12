import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import Factory from '../../abis/Factory'
import Vesting from '../../abis/Vesting'
import Api from '../../api'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import SidebarMenu from '../../components/SidebarMenu'
import TableActivePool from '../../components/TableActivePool'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useMulticall } from '../../hooks/useContract'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { ethBalance } from '../../utils'

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number | string
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}

// type TypeRows = {
//   srcImage?: string
//   name: string
//   address: string
//   claimed: number
//   remain: number
//   start: number
//   end: number
//   claim: number
// }

const Dashboard = () => {
  const { account } = useActiveWeb3React()

  const history = useHistory()

  useEffect(() => {
    !account && history.push({ pathname: `/` })
  }, [account, history])

  const [pools, setPools] = useState<any>([])
  const [poolsResult, setPoolsResult] = useState<Array<any>>([])
  const [poolData, setPoolData] = useState<Array<any>>([])
  const contract = useMulticall() || null

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  const dataETH: TypeItemInfo = {
    heading: 'ETH Balance',
    amount: userEthBalance?.toSignificant(4),
    widthIcon: '28px',
    heightIcon: '39px',
    SrcImageIcon: IconETH,
  }

  const dataCDRED: TypeItemInfo = {
    heading: 'CDRED Balance',
    amount: 0,
    widthIcon: '39px',
    heightIcon: '29px',
    SrcImageIcon: IconCDRED,
  }

  const checkAndGetPool = useCallback(
    async (pool: string) => {
      if (!account) {
        return
      }
      const vestingInstance = new ethers.Contract(pool, Vesting, contract.provider)
      const grant = await vestingInstance.getTokenGrant(account)
      const amount = ethBalance(grant.amount)

      if (amount) {
        const blacklist = await vestingInstance.blacklist(account).catch((e: string) => {
          console.error(e)
        })

        console.log(blacklist)
      }

      return {
        claim: 0,
        address: pool,
        claimed: ethBalance(grant.totalClaimed),
        remain: amount - ethBalance(grant.totalClaimed),
        name: '',
        start: '',
        end: '',
      }
    },
    [account]
  )

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
        const pools = await Api.get(url)

        setPools(pools)
        setPoolsResult(poolResult)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [account, checkAndGetPool])

  useEffect(() => {
    const availablePools: any = [...poolsResult]
    availablePools.forEach((pool: any) => {
      const data = pools.find((x: any) => x.address === pool.address)
      pool.name = data.name
      pool.start = data.start
      pool.end = data.end
    })

    setPoolData(availablePools)
  }, [pools, poolsResult])

  return (
    <DashboardContainer>
      <SidebarMenu />
      <BlockCharts>
        <BlockChartList>
          <BlockChartItem>
            <BlockChart itemInfo={dataETH} />
          </BlockChartItem>
          <BlockChartItem>
            <BlockChart itemInfo={dataCDRED} />
          </BlockChartItem>
        </BlockChartList>
        <BlockTable>
          <TableActivePool data={poolData} />
        </BlockTable>
      </BlockCharts>
    </DashboardContainer>
  )
}
const DashboardContainer = styled.div`
  display: flex;
`

const BlockCharts = styled.div`
  width: 100%;
`

const BlockChartList = styled.div`
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
`
const BlockChartItem = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 8px;
  padding-right: 8px;
`
const BlockTable = styled.div`
  margin-top: 16px;
`
export default Dashboard
