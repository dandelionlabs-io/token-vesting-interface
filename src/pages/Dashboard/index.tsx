import { CurrencyAmount } from '@uniswap/sdk-core'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import AddStake from '../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BrowseAll from '../../assets/svg/icon/icon-eye.svg'
import BlockChart from '../../components/BlockChart'
import BlockFeatureUser from '../../components/BlockFeatureUser'
import TableActivePool from '../../components/TableActivePool'
import { nativeOnChain } from '../../constants/tokens'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useBalance } from '../../hooks/useCurrencyBalance'
import { useFactoryOwner } from '../../hooks/useFactoryOwner'
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
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  const { balance } = useBalance()
  const userCDREDBalance = useCDREDBalance()
  const factory = useFactoryOwner()

  const dispatch = useAppDispatch()

  const dataETH: TypeItemInfo = {
    heading: 'ETH Balance',
    amount:
      balance && chainId ? CurrencyAmount.fromRawAmount(nativeOnChain(chainId), balance).toSignificant(4) : undefined,
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
            {factory.isFactoryOwner && (
              <DivTableBottom onClick={() => handleRedirectPool(typesPoolPage.CREATE_POOL)}>
                <BlockFeatureUser dataImage={IconAddStake} name={'Create New Pool'} />
              </DivTableBottom>
            )}

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
  background-color: rgba(0, 20, 45, 0.6);
  border: solid 1px #002d64;
  backdrop-filter: blur(2px);
  padding: 24px 32px 20px;
  box-shadow: 0px -6px 22px 5px rgba(0, 0, 0, 0.25), 0px 32px 40px -12px rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
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
