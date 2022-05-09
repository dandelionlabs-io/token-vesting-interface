import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../hooks'
import { supportedChainId } from '../../utils/supportedChainId'

import { updateChainId } from './reducer'

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const windowVisible = useIsWindowVisible()

  const [activeChainId, setActiveChainId] = useState(chainId)

  useEffect(() => {
    if (library && chainId && windowVisible) {
      setActiveChainId(chainId)
    }
  }, [dispatch, chainId, library, windowVisible])

  const debouncedChainId = useDebounce(activeChainId, 100)

  useEffect(() => {
    const chainId = debouncedChainId ? supportedChainId(debouncedChainId) ?? null : null
    dispatch(updateChainId({ chainId }))
  }, [dispatch, debouncedChainId])

  return null
}
