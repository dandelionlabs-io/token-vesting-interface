import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import IconPrev from '../../assets/svg/icon/icon-dandelionlabs-prev.svg'
import IconOxy from '../Icons/IconOxy'
interface Props {
  textNameBack: string
  pageBack: string
  typePage: string
}
const GoBack = (props: Props) => {
  const history = useHistory()
  const { textNameBack, pageBack, typePage } = props

  const handleBack = () => {
    window.localStorage.setItem('typePoolPage', typePage)
    history.push({ pathname: pageBack })
  }

  return (
    <GoBackWrapper onClick={handleBack}>
      <IconOxy SrcImageIcon={IconPrev} heightIcon={'9px'} widthIcon={'14px'} />
      <NameBack>{textNameBack}</NameBack>
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
