import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import BgWeb from '../assets/images/bg_page_wallet.jpg'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
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

const BodyWrapper = styled.div`
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
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

export default function App() {
  return (
    <ErrorBoundary>
      <Route />
      <Web3ReactManager>
        <AppWrapper bgImage={BgWeb}>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Popups />
            <Switch>
              <Route path="/" />
            </Switch>
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
