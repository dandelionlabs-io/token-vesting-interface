import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import SidebarMenu from '../../components/SidebarMenu'
import TableActivePool from '../../components/TableActivePool'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { AppState } from '../../state'
import { useAppSelector } from '../../state/hooks'

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number | string
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}

const Dashboard = () => {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const poolData = useAppSelector((state: AppState) => state.pools).data

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
  useEffect(() => {
    !account && history.push({ pathname: `/` })
  }, [account, history])

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
