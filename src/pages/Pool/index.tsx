import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import BlockChart from '../../components/BlockChart'
import GoBack from '../../components/GoBack'
import SidebarMenu from '../../components/SidebarMenu'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { useCDREDBalance } from '../../state/pools/hook'
import BlockUpdateAddress from './BlockUpdateAddress'
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
  const history = useHistory()
  const { account } = useActiveWeb3React()
  const address = window.localStorage.getItem('address')
  const typePage = window.localStorage.getItem('typePoolPage') || ''
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const userCDREDBalance = useCDREDBalance()

  useEffect(() => {
    if (!account || !address) {
      return
    }
  }, [account, address])

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

  const handleBack = (page: string) => {
    window.localStorage.setItem('typePoolPage', page)
    history.push({ pathname: `pool` })
  }

  return (
    <>
      <SidebarMenu />
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
        {(typePage === typesPoolPage.CLAIM || typePage === typesPoolPage.EDIT) && <PoolDetails />}
        {typePage === typesPoolPage.TRANSFER_OWNER && (
          <>
            <RedirectBack onClick={() => handleBack(typesPoolPage.EDIT)}>
              <GoBack data={'Go back to DandelionLabs'} />
            </RedirectBack>
            <BlockUpdateAddress addressWallet={'Ukwx9Vs4C1d9d1fF46g7F'} />
          </>
        )}
        {typePage === typesPoolPage.ADD_STAKEHOLDER && (
          <>
            <RedirectBack onClick={() => handleBack(typesPoolPage.EDIT)}>
              <GoBack data={'Go back to DandelionLabs'} />
            </RedirectBack>
            <StakeHolder />
          </>
        )}
        {typePage === typesPoolPage.EDIT_STAKEHOLDER && (
          <>
            <RedirectBack onClick={() => handleBack(typesPoolPage.EDIT)}>
              <GoBack data={'Go back to DandelionLabs'} />
            </RedirectBack>
            <EditStakeHolder />
          </>
        )}
        {typePage === typesPoolPage.ASSIGN_MANAGER && (
          <>
            <RedirectBack onClick={() => handleBack(typesPoolPage.EDIT)}>
              <GoBack data={'Go back to DandelionLabs'} />
            </RedirectBack>
            <Manager />
          </>
        )}
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

const RedirectBack = styled.div`
  display: flex;
`

export default Pool
