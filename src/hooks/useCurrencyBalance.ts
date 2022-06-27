import useActiveWeb3React from 'hooks/useActiveWeb3React'
import JSBI from 'jsbi'
import { useEffect, useState } from 'react'

import useIsWindowVisible from './useIsWindowVisible'

export function useBalance() {
  const { active, account, chainId, library } = useActiveWeb3React()
  const windowVisible = useIsWindowVisible()
  const [balance, setBalance] = useState<JSBI>()

  const updateBalance = () => {
    if (account && library && chainId && windowVisible) {
      library
        .getBalance(account)
        .then((result) => {
          setBalance(JSBI.BigInt(result))
        })
        .catch((error: any) => {
          console.error(`Failed to get balance`, error)
        })
    } else {
      setBalance(undefined)
    }
  }

  useEffect(() => {
    updateBalance()
  }, [active, chainId, library, account, windowVisible])

  return { balance, updateBalance }
}
