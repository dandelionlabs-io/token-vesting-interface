import { Connector } from '@web3-react/types'
import { darken } from 'polished'
import { Activity } from 'react-feather'
import styled, { css } from 'styled-components/macro'
import { AbstractConnector } from 'web3-react-abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'

import { NetworkContextName } from '../../constants/misc'
import { useWalletModalToggle } from '../../state/application/hooks'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import StatusIcon from '../Identicon/StatusIcon'
import WalletModal from '../Modal/WalletModal'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  height: 40px;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
  font-weight: 500;

  :hover,
  :focus {
    border: none;
    color: ${({ theme }) => theme.white};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.bg0};
      color: ${({ theme }) => theme.text6};
      & > p {
        color: ${({ theme }) => theme.text6};
      }
      :hover,
      :focus {
        background-color: ${({ theme }) => theme.white};
        border: none;
        color: ${({ theme }) => darken(0.05, theme.white)};
      }
    `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
     padding: 8px;
     & > p {
        margin: 0;
     }
  `};
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: transparent;
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  border-radius: 10px;
  border: none;
  font-weight: 500;
  padding: 8px;
  :hover,
  :focus {
    border: none;

    :focus {
      border: none;
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 15px;
  width: fit-content;
  background-color: transparent;
  color: ${({ theme }) => theme.white};
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

function WrappedStatusIcon({ connector }: { connector: AbstractConnector | Connector }) {
  return (
    <IconWrapper size={16}>
      <StatusIcon connector={connector} />
    </IconWrapper>
  )
}

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()

  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal}>
        <Text>{shortenAddress(account)}</Text>
        {connector && <WrappedStatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>Connect Wallet</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  return (
    <>
      <Web3StatusInner />
      {(contextNetwork.active || active) && <WalletModal />}
    </>
  )
}
