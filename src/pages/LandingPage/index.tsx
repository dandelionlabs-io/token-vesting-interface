import React from 'react'
import styled from 'styled-components/macro'

import { PageContainer, PageWrapper } from '../../theme'

const LandingPage = () => {
  return (
    <PageWrapper>
      <PageContainer>
        <Info>Landing page</Info>
      </PageContainer>
    </PageWrapper>
  )
}

const Info = styled.div`
  margin-bottom: 0;
  box-shadow: ${({ theme }) => theme.white};
`

export default LandingPage
