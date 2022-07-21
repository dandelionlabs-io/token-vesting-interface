import { Connector } from '@web3-react/types'
import { darken } from 'polished'
import { useState } from 'react'
import { Activity } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
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

const DropDownDiv = styled.div<{ active: boolean }>`
  position: absolute;
  display: ${({ active }) => (!active ? 'none' : 'flex')};
  flex-direction: column;
  width: 100%;
  border-radius: 16px;
  background: #00142d;
  padding: 15px 10px;
  top: 60px;
  border-radius: 10px;
  box-shadow: 0px -6px 22px 5px rgb(0 0 0 / 25%), 0px 32px 40px -12px rgb(0 0 0 / 65%);
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
const IconDIv = styled.img`
  display: block;
  width: 25px;
  height: 25px;
  vertical-align: middle;
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
  background-color: #44556a;
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
      <Web3StatusConnected id="web3-status-connected">
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
    return <span />
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  const [dropDown, setDropDown] = useState(false)
  const toggleWalletModal = useWalletModalToggle()

  return (
    <div onClick={() => setDropDown(!dropDown)}>
      <Web3StatusInner />
      <DropDownDiv active={dropDown}>
        <DivRow>
          {/* <IconDIv src={Logo_account} alt={'Logo_account'}></IconDIv> */}
          <TextParagraph onClick={toggleWalletModal}>Change wallet</TextParagraph>
        </DivRow>
        <DivRow>
          {/* <IconDIv src={Logo_account} alt={'Logo_account'}></IconDIv> */}

          <Link style={{ textDecoration: 'none' }} to={'support'}>
            <TextParagraph>Contact support</TextParagraph>
          </Link>
        </DivRow>
        <HR></HR>
        <DivRow style={{ marginTop: '10px' }}>
          <TextParagraph style={{ color: '#e92f50' }}>Disconnect</TextParagraph>
        </DivRow>
      </DropDownDiv>
      {(contextNetwork.active || active) && <WalletModal />}
    </div>
  )
}
