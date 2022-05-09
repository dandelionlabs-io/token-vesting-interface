import { createReducer } from '@reduxjs/toolkit'

import { updateVersion } from '../global/actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  timestamp: number
  URLWarningVisible: boolean
}

export const initialState: UserState = {
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateVersion, (state) => {
    state.lastUpdateVersionTimestamp = currentTimestamp()
  })
)
