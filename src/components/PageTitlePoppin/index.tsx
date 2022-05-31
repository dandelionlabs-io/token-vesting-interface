import React from 'react'
import styled from 'styled-components/macro'
interface Props {
  title: string
}
const H3 = styled.h3`
  font-size: 28px;
  line-height: 44px;
  font-weight: 500;
  color: #f6f6f6;
  text-align: center;
`
const PageTitlePoppin = (props: Props) => {
  const { title } = props
  return <H3>{title}</H3>
}

export default PageTitlePoppin
