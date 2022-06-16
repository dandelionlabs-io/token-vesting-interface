import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import AddStake from '../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BrowseAll from '../../assets/svg/icon/icon-eye.svg'
import BlockChart from '../../components/BlockChart'
import BlockFeatureUser from '../../components/BlockFeatureUser'
// import SidebarMenu from '../../components/SidebarMenu'
import TableActivePool from '../../components/TableActivePool'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { useAppDispatch } from '../../state/hooks'
import { useCDREDBalance } from '../../state/pools/hook'
import { updateListStateHolder } from '../../state/pools/reducer'
import { typesPoolPage } from '../Pool'

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

const IconBrowseAll = {
  SrcImageIcon: BrowseAll,
  widthIcon: '16px',
  heightIcon: '15px',
}

const Dashboard = () => {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const userCDREDBalance = useCDREDBalance()

  const dispatch = useAppDispatch()

  const dataETH: TypeItemInfo = {
    heading: 'ETH Balance',
    amount: userEthBalance?.toSignificant(4),
    widthIcon: '28px',
    heightIcon: '39px',
    SrcImageIcon: IconETH,
  }

  const dataCDRED: TypeItemInfo = {
    heading: 'CDRED Balance',
    amount: userCDREDBalance.toFixed(3),
    widthIcon: '39px',
    heightIcon: '29px',
    SrcImageIcon: IconCDRED,
  }

  useEffect(() => {
    !account && history.push({ pathname: `/` })
    window.localStorage.removeItem('address')
    window.localStorage.removeItem('typePoolPage')
  }, [account, history])

  const handleRedirectPool = (typePoolPage: string) => {
    window.localStorage.setItem('typePoolPage', typePoolPage)
    window.localStorage.removeItem('address')

    dispatch(updateListStateHolder([]))
    history.push({ pathname: `pool` })
  }
  return (
    <DashboardContainer>
      {/*<SidebarMenu />*/}
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
          <TableActivePool heading={'Active Pools'} />
          <TableBottom>
            <DivTableBottom onClick={() => handleRedirectPool(typesPoolPage.CREATE_POOL)}>
              <BlockFeatureUser dataImage={IconAddStake} name={'Create New Pool'} />
            </DivTableBottom>
            <DivTableBottom onClick={() => handleRedirectPool(typesPoolPage.LIST_POOL)}>
              <BlockFeatureUser dataImage={IconBrowseAll} name={'Browse all'} />
            </DivTableBottom>
          </TableBottom>
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
const DivTableBottom = styled.div`
  margin-top: 30px;
`
const TableBottom = styled.div`
  display: flex;

  & > div {
    &:last-child {
      margin-left: auto;
    }
  }
`
export default Dashboard
