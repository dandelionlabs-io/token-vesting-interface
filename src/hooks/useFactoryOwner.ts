import { useEffect, useState } from 'react'

import useActiveWeb3React from './useActiveWeb3React'
import { useFactoryContract } from './useContract'

// returns null on errors
export function useFactoryOwner() {
  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()
  const [isFactoryOwner, setIsFactoryOwner] = useState(false)
  const [factoryOwner, setFactoryOwner] = useState(undefined)

  useEffect(() => {
    ;(async () => {
      if (account && factoryContract) {
        const owner = await factoryContract.owner()
        setIsFactoryOwner(owner === account)
        setFactoryOwner(owner)
      }
    })()
  }, [account, factoryContract])
  return { isFactoryOwner, factoryOwner }
}
