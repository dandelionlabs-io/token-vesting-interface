import { useAppSelector } from '../hooks'
import { AppState } from '../index'

export const useURLWarningVisible = () => useAppSelector((state: AppState) => state.user.URLWarningVisible)
