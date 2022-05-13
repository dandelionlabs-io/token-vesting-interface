import { createSlice } from '@reduxjs/toolkit'

export interface IPoolsData {
  name: string
  address: string
  amount: number
  claimable: number
  claimed: any
  remain: any
  start: any
  end: any
  statusClaim?: any
  erc20Balance: number
}

export interface IInitialState {
  data: IPoolsData | any
  addressActive: string
}

const initialState: IInitialState = {
  data: null,
  addressActive: '',
}

const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    updatePoolsData(state: IInitialState, action) {
      state.data = [...action.payload]
    },
    getAddressActive(state: IInitialState, action) {
      state.addressActive = action.payload
    },
  },
})

export const { updatePoolsData, getAddressActive } = poolsSlice.actions
export default poolsSlice.reducer
