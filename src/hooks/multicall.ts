import multicall from '../state/multicall'
import { SkipFirst } from '../types/tuple'
import useActiveWeb3React from './useActiveWeb3React'
import useBlockNumber from './useBlockNumber'

export type { CallStateResult } from '@uniswap/redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience

// Create wrappers for hooks so consumers don't need to get latest block themselves

type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleContractMultipleData(chainId, latestBlock, ...args)
}

function useCallContext() {
  const { chainId } = useActiveWeb3React()
  const latestBlock = useBlockNumber()
  return { chainId, latestBlock }
}
