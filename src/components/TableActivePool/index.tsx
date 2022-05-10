import moment from 'moment'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import IconTableDefault from '../../assets/svg/icon/icon-table-default.svg'
import IconOxy from '../Icons/IconOxy'
interface Props {
  data: {
    columns: TypeColumns[]
    rows: TypeRows[]
  }
}
type TypeColumns = {
  key?: string
  name?: string
}
type TypeRows = {
  srcImage?: string
  name: string
  address: string
  claimed: number
  remain: number
  start: number
  end: number
  claim: number
}
const shortenAddress = (addr: string) => {
  if (addr !== undefined && addr.startsWith('0x')) {
    const length = addr.length
    return addr.slice(0, 6) + '...' + addr.slice(length - 4)
  }
  return addr
}
const TableActivePool = (props: Props) => {
  const { data } = props
  return (
    <TableActivePoolWrapper>
      <Heading>Active Pools</Heading>
      <DivTableBox>
        <Table>
          <thead>
            <tr>
              {data?.columns.map((item, index) => {
                return (
                  <TableTh key={item.key} data-head={item.key}>
                    {item.name}
                  </TableTh>
                )
              })}
            </tr>
          </thead>
          {data.rows && (
            <tbody>
              {data.rows?.map((item, index) => {
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
                      <span>{item.claimed}</span>
                    </td>
                    <td>
                      <span>{item.remain}</span>
                    </td>
                    <td>
                      <span>{moment(item.start).format('MMM DD, YYYY')}</span>
                    </td>
                    <td>
                      <span>{moment(item.end).format('MMM DD, YYYY')}</span>
                    </td>
                    {item.claim === 1 ? (
                      <td>
                        <ButtonClaim active={true}>Claim</ButtonClaim>
                      </td>
                    ) : (
                      <td>
                        <ButtonClaim>Claim</ButtonClaim>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          )}
        </Table>
      </DivTableBox>
      {data.columns.length === 0 && <Notification>No data to show !</Notification>}
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
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      color: ${({ theme }) => theme.white};
      background-color: #18aa00;
    `}
`
export default TableActivePool
