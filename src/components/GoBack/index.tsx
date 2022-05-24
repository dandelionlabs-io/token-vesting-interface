import React from 'react'
import styled from 'styled-components/macro'

import IconPrev from '../../assets/svg/icon/icon-dandelionlabs-prev.svg'
import IconOxy from '../Icons/IconOxy'
interface Props {
  data: string
}
const GoBack = (props: Props) => {
  const { data } = props
  return (
    <GoBackWrapper>
      <IconOxy SrcImageIcon={IconPrev} heightIcon={'9px'} widthIcon={'14px'} />
      <NameBack>{data}</NameBack>
    </GoBackWrapper>
  )
}
const GoBackWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top: 20px;
`
const NameBack = styled.p`
  margin-bottom: 0;
  margin-left: 8px;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  color: ${({ theme }) => theme.text11};
`
export default GoBack
