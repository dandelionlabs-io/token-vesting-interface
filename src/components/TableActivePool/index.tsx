import React from 'react'
import styled from 'styled-components/macro'

const TableActivePool = () => {
  return (
    <TableActivePoolWrapper>
      <Heading>ActivePool</Heading>
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
export default TableActivePool
