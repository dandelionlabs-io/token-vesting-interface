import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import bannerImage from '../../assets/images/bannerImage.png'
import { BaseButton } from '../../components/Button'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useToggleModal } from '../../state/application/hooks'
import { PageContainer, PageWrapper } from '../../theme'

const LandingBanner = styled.div`
  transition: transform 0.3s ease;
  flex: 1;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > svg{
        width: 128px !important;
    }
  `};
`

const LandingSection = styled.div`
  display: flex;
  margin: 90px 0;
  transition: 0.5s;
`

const LandingPage = () => {
  const toggleWalletModal = useToggleModal(0)
  const { account } = useActiveWeb3React()
  const history = useHistory()

  useEffect(() => {
    account && history.push({ pathname: `dashboard` })
  }, [account, history])

  return (
    <PageWrapper>
      <PageContainer>
        <LandingSection>
          <LandingText align="left">
            <Info color="#CC3366">Linear vesting</Info>
            <Header2>Build Trust to Ensure Aligned Incentives</Header2>
            <HeadSpan color="white" fontsize="18px">
              Linear Vesting is a platform that allows stakeholders and companies to build a mutually beneficial
              relationship by providing a transparent and automated vesting system.
            </HeadSpan>

            <WalletConnect onClick={toggleWalletModal}>Connect</WalletConnect>
          </LandingText>
          <LandingBanner>
            <img src={bannerImage} alt="" />
            {/* <Banner width="200px" height="100%" title="logo" /> */}
          </LandingBanner>
        </LandingSection>
        <LandingSection>
          <LandingText align="center">
            <Info color="white">Get In Touch With Us</Info>
            <HeadSpan color="white" fontsize="16px">
              4 Ngo 82 Dich Vong Hau, Cau Giay, Hanoi
            </HeadSpan>
            <HeadSpan color="#CC3366" fontsize="16px">
              hello@dandelionlabs.io
            </HeadSpan>
            <HeadSpan color="white" fontsize="16px">
              +84 0343 788923
            </HeadSpan>
            <div>
              <Circle></Circle>
              <Circle></Circle>
              <Circle></Circle>
              <Circle></Circle>
            </div>
            <HeadSpan color="white" fontsize="13px">
              Copyright ©2021 Dandelion Labs Ltd.
            </HeadSpan>
          </LandingText>
        </LandingSection>
      </PageContainer>
    </PageWrapper>
  )
}
const Circle = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: #ffab40;
  display: inline-block;
  margin-right: 5px;
`

const LandingText = styled.div<{ align: string }>`
  display: flex;
  flex-direction: column;
  flex: 1.5;
  margin: 5px 0;
  text-align: ${({ align }) => align};
  transition: 0.5s;
`
const Info = styled.div`
  margin-bottom: 20px;
  color: ${(props) => props.color};
  // color: ${({ theme }) => theme.primary1};
  box-shadow: ${({ theme }) => theme.white};
`

const Header2 = styled.h2`
  margin-bottom: 30px;
  color: ${({ theme }) => theme.white};
  // font-weight: bold;
  font-size: 40px;
`
const HeadSpan = styled.span<{ fontsize: string; color: string }>`
  // display: block;
  margin-bottom: 10px;
  // color: ${({ theme }) => theme.white};
  color: ${(props) => props.color};
  font-weight: 200;
  font-size: ${(props) => props.fontsize};
  line-height: 28px;
`

const WalletConnect = styled(BaseButton)`
  text-align: center;
  width: 124px;
  padding: 15px 30px;
  color: ${({ theme }) => theme.white};
  background: ${({ theme }) => theme.primary1};
  align-items: baseline;
`

export default LandingPage
