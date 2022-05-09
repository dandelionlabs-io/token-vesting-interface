import useScrollPosition from '@react-hook/window-scroll'
// import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
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

const HeaderHamburger = styled.div<{ className: string }>`
  position: absolute;
  width: 24px;
  display: none;
  cursor: pointer;
  &:before,
  &:after {
    background: #fff;
    content: '';
    display: block;
    height: 3px;
    border-radius: 3px;
    margin: 5px 0;
    transition: 0.5s;
  }
  ${({ className }) =>
    className &&
    css`
      &:before {
        transform: translateY(8px) rotate(135deg);
      }
      &:after {
        transform: translateY(-8px) rotate(-135deg);
      }
      & div {
        transform: scale(0);
      }
    `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`
const DivEmptyStyle = styled.div`
  background: #fff;
  content: '';
  display: block;
  height: 3px;
  border-radius: 3px;
  margin: 5px 0;
  transition: 0.5s;
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
const LinkItemMenu = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  font-size: 15px;
  font-weight: 400;
  padding: 8px 32px;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    background-color: ${({ theme }) => theme.bg6};
    border-radius: 12px;
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

export default function Header() {
  const { account } = useActiveWeb3React()
  // const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const scrollY = useScrollPosition()
  const [toggleMenu, setToggleMenu] = useState(false)
  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu)
  }
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const updateScreenWidthResize = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateScreenWidthResize)
    return () => {
      window.removeEventListener('resize', updateScreenWidthResize)
    }
  }, [screenWidth])

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <HeaderHamburger className={toggleMenu ? 'active' : ''} onClick={handleToggleMenu}>
        <DivEmptyStyle></DivEmptyStyle>
      </HeaderHamburger>
      <Title href=".">
        <DandelionIcon>
          <Logo width="200px" height="100%" title="logo" />
        </DandelionIcon>
      </Title>
      <DivNavbarLanding>
        <ListMenu>
          <LiItemMenu>
            <LinkItemMenu href={'/'} rel={'noreferrer'}>
              Landing
            </LinkItemMenu>
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
  )
}