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
  roles?: string[]
}

export interface IInitialState {
  data: IPoolsData | any
  addressActive: string
  erc20Balance: number
}

const initialState: IInitialState = {
  data: null,
  addressActive: '',
  erc20Balance: 0,
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
    updateErc20Balance(state: IInitialState, action) {
      state.erc20Balance = action.payload
    },
  },
})

export const { updatePoolsData, getAddressActive, updateErc20Balance } = poolsSlice.actions
export default poolsSlice.reducer
