import React from 'react'
import styled from 'styled-components/macro'

import IconOxy from '../Icons/IconOxy'

interface Props {
  itemInfo: {
    heading?: string
    amount?: number
    widthIcon?: string
    heightIcon?: string
    SrcImageIcon?: string
  }
  dataChart?: any
}

const BlockChart = (props: Props) => {
  const { itemInfo, dataChart } = props
  return (
    <BlockChartWrapper>
      <Heading>{itemInfo.heading}</Heading>
      <DivChart>{dataChart === undefined && <Divider></Divider>}</DivChart>
      <DivAmount>
        <IconOxy SrcImageIcon={itemInfo.SrcImageIcon} widthIcon={itemInfo.widthIcon} heightIcon={itemInfo.heightIcon} />
        <TextValue>{itemInfo.amount}</TextValue>
      </DivAmount>
    </BlockChartWrapper>
  )
}
const BlockChartWrapper = styled.div`
  border-radius: 16px;
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: column;
  height: 227px;
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
const DivChart = styled.div`
  flex: 1 1 auto;
  margin-top: 20px;
  margin-bottom: 12px;
  position: relative;
`
const DivAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const TextValue = styled.span`
  color: ${({ theme }) => theme.white};
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.21;
  margin-left: 12px;
`
const Divider = styled.div`
  background-image: linear-gradient(to right, rgba(250, 168, 10, 0), rgba(250, 168, 10, 1));
  height: 2px;
  width: 100%;
  position: absolute;
  bottom: 13px;
  left: 0;
  right: 0;
`
export default BlockChart
