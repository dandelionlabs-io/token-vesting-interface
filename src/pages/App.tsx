import { Route, Switch, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import BgWeb from '../assets/images/bg_page_wallet.jpg'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import SidebarMenu from '../components/SidebarMenu'
import Web3ReactManager from '../components/Web3ReactManager'
import Dashboard from './Dashboard'
const AppWrapper = styled.div<{ bgImage?: string }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: ${(props) =>
    props.bgImage
      ? `linear-gradient(
                    0deg,
                    rgba(10, 37, 27, 0.6),
                    rgba(10, 37, 27, 0.6)
            ),url(${props.bgImage})`
      : 'none'};
`

const BodyWrapper = styled.div<{ bodyDashBoard?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 84px 16px 0 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 56px 16px 8px 16px;
  `};
  ${({ bodyDashBoard }) =>
    bodyDashBoard &&
    css`
      margin-left: 320px;
      margin-top: 85px;
      padding: 32px 60px 0 30px;
      width: calc(100% - 320px);
      display: block;
      flex-direction: unset;
      align-items: unset;
      background-image: linear-gradient(180deg, #01152d 31.72%, #000d1e 100%);
    `}
`

const HeaderWrapper = styled.div<{ headerDashBoard?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
  ${({ headerDashBoard }) =>
    headerDashBoard &&
    css`
      left: 320px;
      display: flex;
      justify-content: flex-end;
      background-color: ${({ theme }) => theme.bgPrimary};
      width: calc(100% - 320px);
      padding: 25px 60px;
    `}
`

export default function App() {
  const location = useLocation()
  return (
    <ErrorBoundary>
      <Route />
      <Web3ReactManager>
        <AppWrapper bgImage={BgWeb}>
          <HeaderWrapper headerDashBoard={location.pathname !== '/' ? true : false}>
            <Header />
          </HeaderWrapper>

          {location.pathname !== '/' && <SidebarMenu />}
          <BodyWrapper bodyDashBoard={location.pathname !== '/' ? true : false}>
            <Popups />
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
