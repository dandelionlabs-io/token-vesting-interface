import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import AddStake from '../../../assets/svg/icon/icon-dandelion-add-circle.svg'
import BlockFeatureUser from '../../../components/BlockFeatureUser'
import TableActivePool from '../../../components/TableActivePool'
import { AppState } from '../../../state'
import { useAppSelector } from '../../../state/hooks'
import { typesPoolPage } from '../index'

const IconAddStake = {
  SrcImageIcon: AddStake,
  widthIcon: '16px',
  heightIcon: '15px',
}

const BrowseAll = () => {
  // const { account } = useActiveWeb3React()
  const history = useHistory()
  const poolData = useAppSelector((state: AppState) => state.pools).data

  const handleRedirectPool = (typePoolPage: string) => {
    window.localStorage.setItem('typePoolPage', typePoolPage)
    window.localStorage.removeItem('address')
    history.push({ pathname: `pool` })
  }

  return (
    <>
      <TableActivePool data={poolData} heading={'Pool List'} />
      <TableBottom>
        <DivTableBottom onClick={() => handleRedirectPool(typesPoolPage.CREATE_POOL)}>
          <BlockFeatureUser dataImage={IconAddStake} name={'Create New Pool'} />
        </DivTableBottom>
      </TableBottom>
    </>
  )
}

const DivTableBottom = styled.div`
  margin-top: 30px;
`
const TableBottom = styled.div`
  display: flex;

  & > div {
    &:last-child {
      margin-top: -40px;
      margin-right: auto;
      margin-left: 40px;
    }
  }
`
export default BrowseAll
