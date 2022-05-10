import React from 'react'
import styled from 'styled-components/macro'

import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart/index'
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
  amount: 34.524,
  widthIcon: '28px',
  heightIcon: '39px',
  SrcImageIcon: IconETH,
}
const dataCDRED: TypeItemInfo = {
  heading: 'CDRED Balance',
  amount: 35595.83,
  widthIcon: '39px',
  heightIcon: '29px',
  SrcImageIcon: IconCDRED,
}
const poolItems = {
  columns: [
    { key: 'name', name: 'Name' },
    { key: 'claimed', name: 'Claimed amt.' },
    { key: 'remain', name: 'Remain amt.' },
    { key: 'start', name: 'Lock start' },
    { key: 'end', name: 'Lock end' },
    { key: 'claim', name: '' },
  ],
  rows: [
    {
      name: 'First',
      address: '0x7CBDA416C1b7CccceBCC31db722B583ab3eAb903',
      claimed: 300000000,
      remain: 200000000,
      start: 1651640400,
      end: 1651740400,
      claim: 1,
    },
    {
      name: 'Second',
      address: '0x7CBDA416C1b7CccceBCC31db722B583ab3eAb903',
      claimed: 300000000,
      remain: 200000000,
      start: 1651640400,
      end: 1651740400,
      claim: 0,
    },
    {
      name: 'Third',
      address: '0x7CBDA416C1b7CccceBCC31db722B583ab3eAb903',
      claimed: 300000000,
      remain: 200000000,
      start: 1651640400,
      end: 1651740400,
      claim: 0,
    },
  ],
}
const Dashboard = () => {
  return (
    <div>
      <BlockChartList>
        <BlockChartItem>
          <BlockChart itemInfo={dataETH} />
        </BlockChartItem>
        <BlockChartItem>
          <BlockChart itemInfo={dataCDRED} />
        </BlockChartItem>
      </BlockChartList>
      <BlockTable>
        <TableActivePool data={poolItems} />
      </BlockTable>
    </div>
  )
}
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
