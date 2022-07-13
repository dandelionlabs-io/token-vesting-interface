import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'

import ERC20_ABI from '../abis/erc20.json'
import Factory from '../abis/Factory'
import { Vesting } from '../abis/Vesting'
import VESTING_ABI from '../abis/vesting.json'
import { Erc20 } from '../types'
import { getContract } from '../utils'
import useActiveWeb3React from './useActiveWeb3React'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useVestingContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Vesting>(tokenAddress, VESTING_ABI, withSignerIfPossible)
}

export function useFactoryContract(withSignerIfPossible?: boolean) {
  return useContract(process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS || '', Factory, withSignerIfPossible)
}
