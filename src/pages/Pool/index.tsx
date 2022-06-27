import { CurrencyAmount } from '@uniswap/sdk-core'
import React, { useEffect } from 'react'
import styled from 'styled-components/macro'

import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import { nativeOnChain } from '../../constants/tokens'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useBalance } from '../../hooks/useCurrencyBalance'
import { useCDREDBalance } from '../../state/pools/hook'
import BlockUpdateAddress from './BlockUpdateAddress'
import BrowseAll from './BrowseAll'
import CreateNewPool from './CreateNewPool'
import Manager from './Manager'
import PoolDetails from './PoolDetails'
import StakeHolder from './StakeHolders'
import EditStakeHolder from './StakeHolders/change'

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number | string
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}

export enum typesPoolPage {
  CLAIM = 'CLAIM',
  EDIT = 'EDIT',
  LIST_POOL = 'LIST_POOL',
  CREATE_POOL = 'CREATE_POOL',
  TRANSFER_OWNER = 'TRANSFER_OWNER',
  ASSIGN_MANAGER = 'ASSIGN_MANAGER',
  ADD_STAKEHOLDER = 'ADD_STAKEHOLDER',
  EDIT_STAKEHOLDER = 'EDIT_STAKEHOLDER',
}

const Pool = () => {
  const { account, chainId } = useActiveWeb3React()
  const poolAddress = window.localStorage.getItem('address')
  const typePage = window.localStorage.getItem('typePoolPage') || ''
  const { balance } = useBalance()
  const userCDREDBalance = useCDREDBalance()

  useEffect(() => {
    if (!account || !poolAddress) {
      return
    }
  }, [account, poolAddress])

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

  return (
    <>
      {/*<SidebarMenu />*/}
      <div>
        <BlockChartList>
          <BlockChartItem>
            <BlockChart itemInfo={dataETH} />
          </BlockChartItem>
          <BlockChartItem>
            <BlockChart itemInfo={dataCDRED} />
          </BlockChartItem>
        </BlockChartList>
        {typePage === typesPoolPage.CREATE_POOL && <CreateNewPool />}
        {typePage === typesPoolPage.LIST_POOL && <BrowseAll />}
        {(typePage === typesPoolPage.CLAIM || typePage === typesPoolPage.EDIT) && <PoolDetails />}
        {typePage === typesPoolPage.TRANSFER_OWNER && (
          <BlockUpdateAddress addressWallet={account || ''} poolAddress={poolAddress || ''} />
        )}
        {typePage === typesPoolPage.ADD_STAKEHOLDER && <StakeHolder />}
        {typePage === typesPoolPage.EDIT_STAKEHOLDER && <EditStakeHolder />}
        {typePage === typesPoolPage.ASSIGN_MANAGER && <Manager />}
      </div>
    </>
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

export default Pool
