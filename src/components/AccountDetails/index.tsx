import { Connector } from '@web3-react/types'
import { ExternalLink as LinkIcon } from 'react-feather'
import styled from 'styled-components/macro'
import { AbstractConnector } from 'web3-react-abstract-connector'

import { injected } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ExternalLink } from '../../theme'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ButtonSecondary } from '../Button'
import StatusIcon from '../Identicon/StatusIcon'
import Copy from './Copy'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  font-weight: 500;
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 1.25;
  text-transform: uppercase;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : ({ theme }) => theme.white)};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.borderCard};
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0;
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.white};
  }
`

const AddressLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.white};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

function WrappedStatusIcon({ connector }: { connector: AbstractConnector | Connector }) {
  return (
    <IconWrapper size={16}>
      <StatusIcon connector={connector} />
    </IconWrapper>
  )
}

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  border-radius: 8px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
    border-color: ${({ theme }) => theme.borderCard};
  }
`

interface AccountDetailsProps {
  toggleWalletModal: () => void
  openOptions: () => void
}

export default function AccountDetails({ toggleWalletModal, openOptions }: AccountDetailsProps) {
  const { chainId, account, connector } = useActiveWeb3React()

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return <WalletName>Connected with {name}</WalletName>
  }

  return (
    <>
      <UpperSection>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div>
                  {connector !== injected && (
                    <WalletAction
                      style={{ fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                      onClick={() => {
                        ;(connector as any).close()
                      }}
                    >
                      Disconnect
                    </WalletAction>
                  )}
                  <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 400 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Change
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  <div>
                    {connector && <WrappedStatusIcon connector={connector} />}
                    <p> {account && shortenAddress(account)}</p>
                  </div>
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <AccountControl>
                  <div>
                    {account && (
                      <Copy toCopy={account}>
                        <span style={{ marginLeft: '4px' }}>Copy Address</span>
                      </Copy>
                    )}
                    {chainId && account && (
                      <AddressLink href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}>
                        <LinkIcon size={16} />
                        <span style={{ marginLeft: '4px' }}>View on Explorer</span>
                      </AddressLink>
                    )}
                  </div>
                </AccountControl>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
    </>
  )
}
