import React from 'react'
import styled, { css } from 'styled-components/macro'

const TableActivePool = () => {
  return (
    <TableActivePoolWrapper>
      <Heading>Active Pools</Heading>
      <DivTableBox>
        <Table>
          <thead>
            <tr>
              <TableTh>Name</TableTh>
              <TableTh width={'130px'}>Claimed</TableTh>
              <TableTh width={'130px'}>Remain</TableTh>
              <TableTh width={'120px'}>Lock start</TableTh>
              <TableTh width={'120px'}>Lock end</TableTh>
            </tr>
          </thead>
        </Table>
      </DivTableBox>
      <Notification>No data to show !</Notification>
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
  &:first-child {
    text-align: left;
  }
  ${({ width }) =>
    width &&
    css`
      width: ${width};
      min-width: ${width};
    `}
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
export default TableActivePool
