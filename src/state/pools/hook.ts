import { useAppSelector } from '../hooks'
import { AppState } from '../index'

export function useCDREDBalance(): number {
  const poolsData = useAppSelector((state: AppState) => state.pools)

  return poolsData.erc20Balance || 0
}
