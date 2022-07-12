import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import styled from 'styled-components/macro'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import IconOxy from '../Icons/IconOxy'
interface Props {
  itemInfo: {
    heading?: string
    amount?: number | string
    widthIcon?: string
    heightIcon?: string
    SrcImageIcon?: string
  }
  dataChart?: any
}
interface DataChart {
  name: string
  amount: number
}
const data: DataChart[] = [
  {
    name: 'Value A',
    amount: 1500,
  },
  {
    name: 'Value B',
    amount: 550,
  },
  {
    name: 'Value C',
    amount: 3000,
  },
  {
    name: 'Value D',
    amount: 2500,
  },
  {
    name: 'Value E',
    amount: 6000,
  },
  {
    name: 'Value F',
    amount: 6500,
  },
  {
    name: 'Value G',
    amount: 8600,
  },
]
const BlockChart = (props: Props) => {
  const location = useLocation()
  const [isPoolPage, setIsPoolPage] = useState<boolean>(true)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    setIsPoolPage(location.pathname === '/pool')
  }, [account, location.pathname])

  const { itemInfo } = props
  return (
    <BlockChartWrapper isPoolPage={isPoolPage}>
      <Heading>{itemInfo.heading}</Heading>
      {!isPoolPage && (
        <DivChart>
          {data.length === 0 ? (
            <Divider></Divider>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Tooltip />
                <Line dataKey="amount" stroke="#FAA80A" dot={false} />
                <XAxis dataKey="name" padding={{ left: 10, right: 10 }} style={{ display: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DivChart>
      )}

      <DivAmount>
        <IconOxy SrcImageIcon={itemInfo.SrcImageIcon} widthIcon={itemInfo.widthIcon} heightIcon={itemInfo.heightIcon} />
        <TextValue>{itemInfo.amount}</TextValue>
      </DivAmount>
    </BlockChartWrapper>
  )
}
const BlockChartWrapper = styled.div<{ isPoolPage: boolean }>`
  border-radius: 16px;
  background-color: rgba(0, 20, 45, 0.6);
  border: solid 1px #002d64;
  backdrop-filter: blur(2px);
  box-shadow: 0px -6px 22px 5px rgba(0, 0, 0, 0.25), 0px 32px 40px -12px rgba(0, 0, 0, 0.65);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: ${({ isPoolPage, theme }) => (!isPoolPage ? 'column' : 'row')};
  height: ${({ isPoolPage, theme }) => (!isPoolPage ? '227px' : '70px')};
  box-sizing: border-box;

  & > h3 {
    margin-right: ${({ isPoolPage, theme }) => isPoolPage && 'auto'};
  }
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
