import useScrollPosition from '@react-hook/window-scroll'
// import useTheme from 'hooks/useTheme'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { ReactComponent as Logo } from '../../assets/svg/dandelionlabs_logo_dashboard.svg'
// import Logo_account from '../../assets/svg/logo_account.svg'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
// import { shortenAddress } from '../../utils'
import Web3Status from '../Web3Status'

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
const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  padding-left: 12px;
  flex: 0 0 212px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 0 0 140px;
  `};
`
const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  white-space: nowrap;
  width: 100%;
  height: 40px;
  padding-left: ${({ active }) => (!active ? 0 : '14px')};
`
const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`
const InfoAccount = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  &:hover {
    // border: 1px solid black;
    border-radius: 20px;
  }
`

const DropDownDiv = styled.div<{ active: boolean }>`
  position: absolute;
  display: ${({ active }) => (!active ? 'none' : 'flex')};
  flex-direction: column;
  width: 120%;
  border-radius: 16px;
  background: #00142d;
  padding: 15px 10px;
  top: 50px;
  border-radius: 10px;
  box-shadow: 0px -6px 22px 5px rgb(0 0 0 / 25%), 0px 32px 40px -12px rgb(0 0 0 / 65%);
`

const AddressWallet = styled.p`
  margin-bottom: 0;
  color: ${({ theme }) => theme.white};
  font-size: 13px;
  line-height: 1.215;
  margin-right: 12px;
`
const TextParagraph = styled.p`
  margin-bottom: 0;
  color: ${({ theme }) => theme.white};
  font-size: 13px;
  line-height: 1.215;
  padding: 0 10px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`
const LogoAccount = styled.img`
  display: block;
  width: 35px;
  height: 35px;
  vertical-align: middle;
`
const IconDIv = styled.img`
  display: block;
  width: 25px;
  height: 25px;
  vertical-align: middle;
`
const DivSegment = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
`
const DivRow = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 1px;
`
const HR = styled.hr`
  display: flex;
  align-items: center;
  width: 100%;
  height: 0.5px;
  border: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgPrimary};
`
export default function Header() {
  const { account } = useActiveWeb3React()
  const scrollY = useScrollPosition()
  const location = useLocation()

  return (
    <>
      {location.pathname !== '/' ? (
        <>
          <Title href=".">
            <DandelionIcon>
              <Logo width="200px" height="100%" title="logo" />
            </DandelionIcon>
          </Title>
          <InfoAccount>
            <DivSegment>
              {/* <AddressWallet>{account && shortenAddress(account)}</AddressWallet>
              <LogoAccount src={Logo_account} alt={'Logo_account'}></LogoAccount> */}
              <AccountElement active={!!account}>
                <Web3Status />
              </AccountElement>
            </DivSegment>
          </InfoAccount>
        </>
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
          <HeaderControls>
            <HeaderElement>
              <AccountElement active={!!account}>
                <Web3Status />
              </AccountElement>
            </HeaderElement>
          </HeaderControls>
        </HeaderFrame>
      )}
    </>
  )
}
