import 'rc-pagination/assets/index.css'

import moment from 'moment'
import Pagination from 'rc-pagination'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import IconTableEdit from '../../assets/svg/icon/icon-dandelion-edit.svg'
import IconSort from '../../assets/svg/icon/icon-dandelion-polygon-down.svg'
import IconTableDefault from '../../assets/svg/icon/icon-table-default.svg'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { typesPoolPage } from '../../pages/Pool'
import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { IPoolsData, IState, RolePoolAddress, updateFiltersStatePool } from '../../state/pools/reducer'
import { shortenAddress } from '../../utils'
import IconOxy from '../Icons/IconOxy'

interface Props {
  heading: string
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

export enum ListTabs {
  ALL = 'all',
  CLAIMABLE = 'claimable',
  UPCOMING = 'upcoming',
  CLAIMED = 'claimed',
  BANNED = 'banned',
}

export enum StatusClaimButton {
  ACTIVE = 'active',
  DISABLE = 'disable',
  BANNED = 'banned',
  CLAIMED = 'claimed',
  EXPIRED = 'expired',
}

const TableActivePool = ({ heading }: Props) => {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const alphabet = useRef<boolean>(true)
  const typePage = window.localStorage.getItem('typePoolPage')
  const [activeTab, setActiveTab] = useState<string>(ListTabs.ALL)

  const state: IState | null = useAppSelector((state) => state.pools)
  const { page, size, totalPool, data } = state
  const dispatch = useAppDispatch()
  const handleRedirectPoolDetails = (item: any, typePoolPage: string) => {
    const status = handleSetStatusClaim(item)
    if (status !== StatusClaimButton.ACTIVE && typePoolPage === typesPoolPage.CLAIM) {
      return
    }

    window.localStorage.setItem('address', item.address)
    window.localStorage.setItem('typePoolPage', typePoolPage)
    history.push({ pathname: `pool` })
  }

  const handleSortPools = () => {
    alphabet.current = !alphabet.current
    dispatch(updateFiltersStatePool({ sort: alphabet.current ? 'ASC' : 'DESC' }))
  }

  const handleOnChange = (page: number) => {
    dispatch(updateFiltersStatePool({ page }))
  }

  const handleSetStatusClaim = useCallback(
    (item: IPoolsData) => {
      const currentDayTime = new Date().getTime()

      if (account && !!item.blackList.length && item.blackList.includes(account)) {
        return StatusClaimButton.BANNED
      }

      if (item.end && currentDayTime > item.end) {
        return StatusClaimButton.EXPIRED
      }

      if (item.claimable >= 0.1 && item.start && currentDayTime > item.start) {
        return StatusClaimButton.ACTIVE
      }

      if (
        (item.claimable < 0.1 && item.start && currentDayTime > item.start) ||
        (item.start && currentDayTime < item.start)
      ) {
        return StatusClaimButton.DISABLE
      }

      if (item.amount > 0 && item.amount === item.claimed) {
        return StatusClaimButton.CLAIMED
      }

      return StatusClaimButton.ACTIVE
    },
    [account]
  )

  useEffect(() => {
    let typePool = ''
    if (!typePage) {
      typePool = 'activePool'
    } else {
      typePool = activeTab
    }

    dispatch(updateFiltersStatePool({ typePool, page: 1, size: 8, sort: 'ASC' }))
  }, [activeTab, dispatch, typePage, totalPool])

  const handleFilter = useCallback(
    async (item: string) => {
      alphabet.current = true
      setActiveTab(item)
    },
    [dispatch]
  )

  const handleShowStatusClaim = (item: IPoolsData) => {
    const status = handleSetStatusClaim(item)

    switch (status) {
      case StatusClaimButton.EXPIRED:
        return StatusClaimButton.EXPIRED
      case StatusClaimButton.BANNED:
        return StatusClaimButton.BANNED
      case StatusClaimButton.CLAIMED:
        return StatusClaimButton.CLAIMED
      default:
        return 'Claim'
    }
  }

  const handleShowButtonClaim = (item: IPoolsData) => {
    return handleSetStatusClaim(item)
  }

  return (
    <>
      {typePage === typesPoolPage.LIST_POOL && (
        <DivTabFilters>
          {Object.values(ListTabs).map((item, index) => (
            <TabFilter active={item === activeTab} onClick={() => handleFilter(item)} key={index}>
              {item}
            </TabFilter>
          ))}
        </DivTabFilters>
      )}
      <BlockTable isListPool={typePage === typesPoolPage.LIST_POOL}>
        <TableActivePoolWrapper>
          <Heading>{heading}</Heading>

          <DivTableBox>
            <Table>
              <thead>
                <tr>
                  {columns.map((item, index) => {
                    return index === 0 ? (
                      <TableTh key={item.key} data-head={item.key}>
                        <DivTableThFirst>
                          {item.name}
                          <DivIconSort reverse={alphabet.current} onClick={handleSortPools}>
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
                            <ButtonClaim
                              status={handleShowButtonClaim(item)}
                              onClick={() => handleRedirectPoolDetails(item, typesPoolPage.CLAIM)}
                            >
                              {handleShowStatusClaim(item)}
                            </ButtonClaim>
                            {(item.roles.includes(RolePoolAddress.OPERATOR) ||
                              item.roles.includes(RolePoolAddress.ADMIN)) &&
                              handleShowStatusClaim(item) !== StatusClaimButton.BANNED &&
                              handleShowStatusClaim(item) !== StatusClaimButton.EXPIRED && (
                                <DivIcon onClick={() => handleRedirectPoolDetails(item, typesPoolPage.EDIT)}>
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
          {data && !data.length ? (
            <Notification>No data to show !</Notification>
          ) : (
            <Bottom>
              <Pagination simple onChange={handleOnChange} pageSize={size} current={page} total={totalPool} />
            </Bottom>
          )}
        </TableActivePoolWrapper>
      </BlockTable>
    </>
  )
}

const BlockTable = styled.div<{ isListPool?: boolean }>`
  border-radius: 16px;

  ${({ isListPool }) =>
    isListPool &&
    css`
      background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
      padding: 24px 32px 20px;
    `}
`

const DivTabFilters = styled.div`
  display: flex;
  margin: 30px 30px 0 30px;
  color: ${({ theme }) => theme.white};
`

const TabFilter = styled.div<{ active: boolean }>`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 30px;
  gap: 10px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin-right: 10px;
  background: ${({ active, theme }) => (active ? theme.blue4 : theme.bgPrimary)};
  text-transform: ${({ active }) => (active ? 'uppercase' : 'capitalize')};
  color: ${({ active, theme }) => (active ? theme.white : theme.text11)};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
`

const Bottom = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;

  & button {
    background: none !important;
    border: none !important;
    &:after {
      margin-top: -5px;
      display: inline-flex;
      font-size: 25px !important;
      color: ${({ theme }) => theme.white};
    }

    &[disabled] {
      &:after {
        color: ${({ theme }) => theme.text2} !important;
      }
    }
  }

  & .rc-pagination-item {
    background: none !important;
    border: none;

    & a {
      color: ${({ theme }) => theme.white};
    }

    &-active {
      & a {
        color: ${({ theme }) => theme.yellow1};
      }
    }
  }
  & .rc-pagination-simple-pager {
    color: ${({ theme }) => theme.white};

    input,
    span {
      background: none;
      color: ${({ theme }) => theme.white};
      border: none;
      font-size: 14px !important;
    }

    input {
      padding: 0;
      margin-right: -5px;
      font-size: 15px !important;
    }
  }

  & .rc-pagination-prev {
    margin-right: 0;
  }
`

const TableActivePoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 460px;
  box-sizing: border-box;
`
const Heading = styled.h3`
  color: ${({ theme }) => theme.yellow3};
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
const ButtonClaim = styled.button<{ status?: string }>`
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
  text-transform: capitalize;

  ${({ status, theme }) => {
    switch (status) {
      case StatusClaimButton.ACTIVE:
        return `
					color: ${theme.white};
					background-color: #18aa00;
					cursor: pointer;`
      case StatusClaimButton.DISABLE:
        return `
          color: rgba(109, 149, 199, 0.3);
          background-color: rgba(0, 28, 60, 0.4);
        `
      case StatusClaimButton.EXPIRED:
        return `
 		      color: ${theme.bgPrimary};
          background-color: ${theme.text11};
        `
      case StatusClaimButton.BANNED:
        return `
					color: ${theme.white};
          background-color: ${theme.red1};`
      case StatusClaimButton.CLAIMED:
        return `
          color: ${theme.white};
          background-color: ${theme.red1};
        `
      default:
        return ''
    }
  }}
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
const DivIconSort = styled.div<{ reverse?: boolean }>`
  transform: ${({ reverse }) => (reverse ? 'rotate(180deg)' : 'rotate(0deg)')};
  margin-left: 10px;
  cursor: pointer;
`
export default TableActivePool
