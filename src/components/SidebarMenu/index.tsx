import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'

import Logo from '../../assets/svg/dandelionlabs_logo_dashboard.svg'
import IconHomeActive from '../../assets/svg/icon/icon-home-dashboard.svg'
import IconHomeDefault from '../../assets/svg/icon/icon-home-dashboard-default.svg'
import IconPoolActive from '../../assets/svg/icon/icon-pool-dashboard.svg'
import IconPoolDefault from '../../assets/svg/icon/icon-pool-dashboard-default.svg'
import IconOxy from '../Icons/IconOxy'
const ListLink = styled.div`
  border-top: 1px solid #00142d;
  padding-top: 32px;
  padding-bottom: 32px;
`
const activeClassName = 'ACTIVE'
const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  background-color: transparent;
  padding: 12px 22px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  color: ${({ theme }) => theme.textGray};
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-transform: capitalize;
  & > .img-active {
    display: none;
  }
  & > .img-default {
    display: block;
  }
  &.${activeClassName} {
    font-weight: 700;
    font-size: 20px;
    border-radius: 16px;
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.bgPrimaryLight};
    & > .img-active {
      display: block;
    }
    & > .img-default {
      display: none;
    }
  }
`
const SidebarMenuWrapper = styled.div`
  position: fixed;
  width: 320px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.bgPrimary};
  padding: 20px 32px 32px;
`
const SidebarMenuLogo = styled.div`
  margin-bottom: 20px;
`
const SidebarMenuImage = styled.img`
  display: block;
  max-width: 206px;
  height: 45px;
  margin: 0 auto;
`
const LinkName = styled.p`
  margin-left: 10px;
  margin-bottom: 0;
`
const DivImageNormal = styled.div``
const DivImageActive = styled.div``
const NoteCopyright = styled.p`
  margin-bottom: 0;
  font-size: 12px;
  line-height: 1.25;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  color: ${({ theme }) => theme.text8};
  text-transform: unset;
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`
const SidebarMenu = () => {
  return (
    <SidebarMenuWrapper>
      <SidebarMenuLogo>
        <SidebarMenuImage src={Logo} alt={'Logo'} />
      </SidebarMenuLogo>
      <ListLink>
        <StyledNavLink id={`dashboard`} to={'/dashboard'}>
          <DivImageNormal className={'img-default'}>
            <IconOxy SrcImageIcon={IconHomeDefault} widthIcon={'24px'} heightIcon={'24px'} />
          </DivImageNormal>
          <DivImageActive className={'img-active'}>
            <IconOxy SrcImageIcon={IconHomeActive} widthIcon={'24px'} heightIcon={'24px'} />
          </DivImageActive>
          <LinkName>Dashboard</LinkName>
        </StyledNavLink>
        <StyledNavLink id={`pool`} to={'/pool'}>
          <DivImageNormal className={'img-default'}>
            <IconOxy SrcImageIcon={IconPoolDefault} widthIcon={'24px'} heightIcon={'24px'} />
          </DivImageNormal>
          <DivImageActive className={'img-active'}>
            <IconOxy SrcImageIcon={IconPoolActive} widthIcon={'24px'} heightIcon={'24px'} />
          </DivImageActive>
          <LinkName>Pool</LinkName>
        </StyledNavLink>
      </ListLink>
      <NoteCopyright>Copyright ©2022 Dandelion Labs JSC.</NoteCopyright>
    </SidebarMenuWrapper>
  )
}

export default SidebarMenu
