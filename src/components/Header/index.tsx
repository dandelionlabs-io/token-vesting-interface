import useScrollPosition from '@react-hook/window-scroll'
// import useTheme from 'hooks/useTheme'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { ReactComponent as Logo } from '../../assets/svg/dandelionlabs_logo_dashboard.svg'
import Logo_account from '../../assets/svg/logo_account.svg'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { shortenAddress } from '../../utils'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg5} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 8px 16px;
  `};
`
const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  padding-right: 12px;
  flex: 0 0 212px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 30px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    flex: 0 0 140px;
  `};
  :hover {
    cursor: pointer;
  }
`
const DandelionIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }

  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > svg{
        width: 128px !important;
    }
  `};
`
const DivNavbarLanding = styled.div`
  color: ${({ theme }) => theme.white};
  margin-left: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    top:84px;
    left: 0;
    bottom: 0;
    width: 200px;
    margin: 0;
    border-radius: 0;
    background-color: rgba(0,0,0,0.7);
    z-index: 1000;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    top:56px;
  `};
`
const ListMenu = styled.ul`
  display: flex;
  padding-left: 12px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     display: block;
     padding-right: 12px;
     padding-top: 12px;
  `};
`
const LiItemMenu = styled.li`
  list-style: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
      margin-bottom: 12px;
      &:last-of-type{
      margin-bottom: 0;
  `};
`
const LinkItemMenu = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  font-size: 15px;
  font-weight: 400;
  padding: 8px 32px;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    color: ${({ theme }) => theme.primary1};
    // border-radius: 12px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
     display: block;
     width: 100%;
  `};
`
const InfoAccount = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`
const AddressWallet = styled.p`
  margin-bottom: 0;
  color: ${({ theme }) => theme.white};
  font-size: 14px;
  line-height: 1.215;
  margin-right: 12px;
`
const LogoAccount = styled.img`
  display: block;
  width: 35px;
  height: 35px;
  vertical-align: middle;
`
export default function Header() {
  const { account } = useActiveWeb3React()
  const scrollY = useScrollPosition()
  const location = useLocation()
  return (
    <>
      {location.pathname !== '/' ? (
        <InfoAccount>
          <AddressWallet>{account && shortenAddress(account)}</AddressWallet>
          <LogoAccount src={Logo_account} alt={'Logo_account'}></LogoAccount>
        </InfoAccount>
      ) : (
        <HeaderFrame showBackground={scrollY > 45}>
          <Title href=".">
            <DandelionIcon>
              <Logo width="200px" height="100%" title="logo" />
            </DandelionIcon>
          </Title>
          <DivNavbarLanding>
            <ListMenu>
              <LiItemMenu>
                <LinkItemMenu to={'#'}>About</LinkItemMenu>
                <LinkItemMenu to={'#'}>Careers</LinkItemMenu>
                <LinkItemMenu to={'#'}>Blog</LinkItemMenu>
                <LinkItemMenu to={'#'}>Contact</LinkItemMenu>
              </LiItemMenu>
            </ListMenu>
          </DivNavbarLanding>
        </HeaderFrame>
      )}
    </>
  )
}
