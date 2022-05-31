import React from 'react'
import styled from 'styled-components/macro'
interface Props {
  title?: string
}
const TitleOptionNewPool = (props: Props) => {
  const { title } = props
  return (
    <Wrapper>
      <HeadingOption>{title ? title : ''}</HeadingOption>
      <Divider></Divider>
    </Wrapper>
  )
}
const Wrapper = styled.div``
const HeadingOption = styled.h3`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  padding-left: 5px;
  padding-bottom: 20px;
  height: 40px;
`
const Divider = styled.div`
  border-top: 1.5px solid ${({ theme }) => theme.blue7};
`
export default TitleOptionNewPool
