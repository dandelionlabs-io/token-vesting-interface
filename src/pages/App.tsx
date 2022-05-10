import { Route, Switch, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import SidebarMenu from '../components/SidebarMenu'
import Web3ReactManager from '../components/Web3ReactManager'
import Dashboard from './Dashboard'
import LandingPage from './LandingPage'
const AppWrapper = styled.div<{ bgImage?: string }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: ${({ theme }) => theme.bg5};
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
      padding: 32px 60px 60px 30px;
      width: calc(100% - 320px);
      display: block;
      flex-direction: unset;
      align-items: unset;
      background-image: linear-gradient(180deg, #01152d 31.72%, #011024 100%);
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
const FooterWrapper = styled.div`
  position: fixed;
  height: 40px;
  bottom: 0;
  left: 320px;
  right: 0;
  width: calc(100% - 320px);
  z-index: 2;
  background-color: #011024;
`
const FooterContent = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.white};
  text-align: right;
  margin-right: 60px;
  margin-top: 10px;
  & > span {
    font-weight: 700;
  }
`
export default function App() {
  const location = useLocation()
  return (
    <ErrorBoundary>
      <Web3ReactManager>
        <AppWrapper>
          <HeaderWrapper headerDashBoard={location.pathname !== '/' ? true : false}>
            <Header />
          </HeaderWrapper>

          {location.pathname !== '/' && <SidebarMenu />}
          <BodyWrapper bodyDashBoard={location.pathname !== '/' ? true : false}>
            <Popups />
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </BodyWrapper>
          {location.pathname !== '/' && (
            <FooterWrapper>
              <FooterContent>
                <span>Blockchain:</span> Ethereum Testnet Rinkeby
              </FooterContent>
            </FooterWrapper>
          )}
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
