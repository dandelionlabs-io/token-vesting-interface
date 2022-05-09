import React from 'react'
import styled from 'styled-components/macro'

import { BaseButton } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { PageContainer, PageWrapper } from '../../theme'

const LandingPage = () => {
  const toggleWalletModal = useWalletModalToggle()

  return (
    <PageWrapper>
      <PageContainer>
        <Info>Landing page</Info>
        <WalletConnect onClick={toggleWalletModal}>Connect</WalletConnect>
      </PageContainer>
    </PageWrapper>
  )
}

const Info = styled.div`
  margin-bottom: 0;
  box-shadow: ${({ theme }) => theme.white};
`

const WalletConnect = styled(BaseButton)`
  text-align: center;
  width: auto;
  padding: 15px 30px;
`

export default LandingPage
