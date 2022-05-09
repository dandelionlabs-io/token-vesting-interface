import { createMulticall } from '@uniswap/redux-multicall'
import { combineReducers, createStore } from 'redux'

import useActiveWeb3React from '../hooks/useActiveWeb3React'
import useBlockNumber from '../hooks/useBlockNumber'
import { useMulticall } from '../hooks/useContract'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)

export default multicall

export function MulticallUpdater() {
  const latestBlockNumber = useBlockNumber()
  const { chainId } = useActiveWeb3React()
  const contract = useMulticall()
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}
