import React from 'react'
import styled from 'styled-components/macro'

import { BaseButton } from '../../components/Button'
import { PageContainer, PageWrapper } from '../../theme'

const LandingPage = () => {
  return (
    <PageWrapper>
      <PageContainer>
        <Info>Landing page</Info>
        <BaseButton width="auto" padding="15px 30px">
          Connect
        </BaseButton>
      </PageContainer>
    </PageWrapper>
  )
}

const Info = styled.div`
  margin-bottom: 0;
  box-shadow: ${({ theme }) => theme.white};
`

export default LandingPage
