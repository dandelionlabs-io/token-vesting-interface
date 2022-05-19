import moment from 'moment'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import IconTableEdit from '../../assets/svg/icon/icon-dandelion-edit.svg'
import IconSort from '../../assets/svg/icon/icon-dandelion-polygon-down.svg'
import IconTableDefault from '../../assets/svg/icon/icon-table-default.svg'
import { useAppDispatch } from '../../state/hooks'
import { getAddressActive, IPoolsData, sortPoolsData } from '../../state/pools/reducer'
import { shortenAddress } from '../../utils'
import IconOxy from '../Icons/IconOxy'
interface Props {
  data: IPoolsData[] | null
}
type TypeColumns = {
  key?: string
  name?: string
}

const columns: TypeColumns[] = [
  { key: 'name', name: 'Name' },
  { key: 'claimed', name: 'Claimed amt.' },
  { key: 'remain', name: 'Remain amt.' },
  { key: 'start', name: 'Lock start' },
  { key: 'end', name: 'Lock end' },
  { key: 'claim', name: '' },
]

const TableActivePool = (props: Props) => {
  const { data } = props
  const dispatch = useAppDispatch()
  const history = useHistory()

  const handleRedirectPoolDetails = (address: string, poolPageType: string) => {
    dispatch(getAddressActive(address))

    window.localStorage.setItem('address', address)
    window.localStorage.setItem('poolPageType', poolPageType)
    history.push({ pathname: `pool` })
  }
  const handleButtonClaim = (item: IPoolsData) => {
    if (!item.roles.includes('STAKEHOLDER')) {
      return
    }
    if (item.statusClaim === 1) {
      return (
        <ButtonClaim active={true} onClick={() => handleRedirectPoolDetails(item.address, 'claim')}>
          Claim
        </ButtonClaim>
      )
    }
    return <ButtonClaim active={false}>Claim</ButtonClaim>
  }
  const handleSortPools = (data: any) => {
    dispatch(sortPoolsData(data))
  }
  return (
    <TableActivePoolWrapper>
      <Heading>Active Pools</Heading>
      <DivTableBox>
        <Table>
          <thead>
            <tr>
              {columns.map((item, index) => {
                return index === 0 ? (
                  <TableTh key={item.key} data-head={item.key}>
                    <DivTableThFirst>
                      {item.name}
                      <DivIconSort onClick={() => handleSortPools(data)}>
                        <IconOxy SrcImageIcon={IconSort} widthIcon={'12px'} heightIcon={'12px'} />
                      </DivIconSort>
                    </DivTableThFirst>
                  </TableTh>
                ) : (
                  <TableTh key={item.key} data-head={item.key}>
                    {item.name}
                  </TableTh>
                )
              })}
            </tr>
          </thead>
          {data && !!data?.length && (
            <tbody>
              {data?.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td>
                      <DivNameBox>
                        <IconOxy
                          SrcImageIcon={item.srcImage !== undefined ? item.srcImage : IconTableDefault}
                          widthIcon={'14px'}
                          heightIcon={'14px'}
                        />
                        <NamePool>{item.name}</NamePool>
                        <AddressWallet>( {shortenAddress(item.address)} )</AddressWallet>
                      </DivNameBox>
                    </td>
                    <td>
                      <span>{parseFloat(item.claimed).toFixed(3)}</span>
                    </td>
                    <td>
                      <span>{parseFloat(item.remain).toFixed(3)}</span>
                    </td>
                    <td>
                      <span>{moment(item.start).format('MMM DD, YYYY')}</span>
                    </td>
                    <td>
                      <span>{moment(item.end).format('MMM DD, YYYY')}</span>
                    </td>
                    <td>
                      <DivAct>
                        {handleButtonClaim(item)}
                        {(item.roles.includes('OPERATOR') || item.roles.includes('ADMIN')) && (
                          <DivIcon onClick={() => handleRedirectPoolDetails(item.address, 'edit')}>
                            <IconOxy SrcImageIcon={IconTableEdit} widthIcon={'20px'} heightIcon={'20px'} />
                          </DivIcon>
                        )}
                      </DivAct>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </Table>
      </DivTableBox>
      {data && !data.length && <Notification>No data to show !</Notification>}
    </TableActivePoolWrapper>
  )
}
const TableActivePoolWrapper = styled.div`
  border-radius: 16px;
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: column;
  min-height: 460px;
  box-sizing: border-box;
`
const Heading = styled.h3`
  color: ${({ theme }) => theme.white};
  font-size: 20px;
  line-height: 1.2;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 700;
  text-transform: unset;
`
const DivTableBox = styled.div`
  margin-top: 8px;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead tr {
    border-bottom: 1px solid #00316f;
  }

  tbody tr {
    border-bottom: 1px dashed #00316f;
  }
  tbody tr td {
    color: ${({ theme }) => theme.white};
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-align: right;
    padding: 20px 8px;
  }
`
const TableTh = styled.th<{ width?: string }>`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  color: ${({ theme }) => theme.white};
  padding: 20px 8px;
  text-align: right;
  white-space: nowrap;
  &:first-child {
    text-align: left;
  }
  ${({ width }) =>
    width &&
    css`
      width: ${width};
      min-width: ${width};
    `}
  &[data-head='claimed'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='remain'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='start'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='end'] {
    width: 130px;
    min-width: 130px;
  }
  &:last-of-type {
    max-width: 130px;
    width: 120px;
  }
`
const Notification = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  color: ${({ theme }) => theme.white};
  text-align: center;
  padding-top: 100px;
`
const DivNameBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`
const NamePool = styled.p`
  color: ${({ theme }) => theme.white};
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  margin: 0 8px;
  text-transform: capitalize;
`
const AddressWallet = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.text8};
`
const ButtonClaim = styled.button<{ active?: boolean }>`
  outline: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.25;
  padding: 4px 12px;
  color: rgba(109, 149, 199, 0.3);
  background-color: rgba(0, 28, 60, 0.4);
  border-radius: 12px;

  ${({ active }) =>
    active &&
    css`
      color: ${({ theme }) => theme.white};
      background-color: #18aa00;
      cursor: pointer;
    `}
`
const DivAct = styled.div`
  display: flex;
  justify-content: flex-end;
`
const DivIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 24px;
  position: relative;
  &:first-child {
    padding-left: 0;
    &::before {
      display: none;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12px;
    width: 1px;
    background-color: ${({ theme }) => theme.blue5};
  }
  & > span {
    cursor: pointer;
  }
`
const DivTableThFirst = styled.div`
  display: flex;
  align-items: center;
`
const DivIconSort = styled.div`
  margin-left: 10px;
  cursor: pointer;
`
export default TableActivePool
