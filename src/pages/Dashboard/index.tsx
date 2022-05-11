import React from 'react'
import styled from 'styled-components/macro'

import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import SidebarMenu from '../../components/SidebarMenu'
import TableActivePool from '../../components/TableActivePool'

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}

const dataETH: TypeItemInfo = {
  heading: 'ETH Balance',
  amount: 0,
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

const Dashboard = () => {
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
          <TableActivePool />
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
