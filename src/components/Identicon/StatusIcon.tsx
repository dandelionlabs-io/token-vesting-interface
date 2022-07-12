import { Connector } from '@web3-react/types'
import WalletConnectIcon from 'assets/images/wallet-connect-icon.svg'
import { AbstractConnector } from 'web3-react-abstract-connector'

import { injected, walletconnect } from '../../connectors'
import Identicon from './index'

export default function StatusIcon({ connector }: { connector: AbstractConnector | Connector }) {
  switch (connector) {
    case injected:
      return <Identicon />
    case walletconnect:
      return <img src={WalletConnectIcon} alt={'WalletConnect'} />
    default:
      return null
  }
}
