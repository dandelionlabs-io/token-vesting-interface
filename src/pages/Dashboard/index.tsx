import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import AddStake from '../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import BlockFeatureUser from '../../components/BlockFeatureUser'
import SidebarMenu from '../../components/SidebarMenu'
import TableActivePool from '../../components/TableActivePool'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { AppState } from '../../state'
import { useAppSelector } from '../../state/hooks'
import { useCDREDBalance } from '../../state/pools/hook'

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number | string
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}
const IconAddStake = {
  SrcImageIcon: AddStake,
  widthIcon: '16px',
  heightIcon: '15px',
}
const Dashboard = () => {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const poolData = useAppSelector((state: AppState) => state.pools).data

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const userCDREDBalance = useCDREDBalance()

  const dataETH: TypeItemInfo = {
    heading: 'ETH Balance',
    amount: userEthBalance?.toSignificant(4),
    widthIcon: '28px',
    heightIcon: '39px',
    SrcImageIcon: IconETH,
  }

  const dataCDRED: TypeItemInfo = {
    heading: 'CDRED Balance',
    amount: userCDREDBalance,
    widthIcon: '39px',
    heightIcon: '29px',
    SrcImageIcon: IconCDRED,
  }
  useEffect(() => {
    !account && history.push({ pathname: `/` })
    window.localStorage.removeItem('address')
    window.localStorage.removeItem('poolPageType')
    window.localStorage.removeItem('flagPool')
  }, [account, history])
  const handleRedirectPool = (poolPageType: string) => {
    window.localStorage.setItem('poolPageType', poolPageType)
    window.localStorage.setItem('flagPool', 'true')
    window.localStorage.removeItem('address')
    history.push({ pathname: `pool` })
  }
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
          <DivCreatePool onClick={() => handleRedirectPool('createPool')}>
            <BlockFeatureUser dataImage={IconAddStake} name={'Create New Pool'} />
          </DivCreatePool>
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
  border-radius: 16px;
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px 20px;
`
const DivCreatePool = styled.div`
  margin-top: 30px;
`
export default Dashboard
