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
  roles: string[]
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

export enum RolePoolAddress {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  STAKEHOLDER = 'STAKEHOLDER',
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
    setRoleForPoolAddress(state: IInitialState, action) {
      const index: number = state.data.findIndex((o: any) => o.address === action.payload.address)
      const data: IPoolsData[] = [...state.data] || []
      let dataRoleIndex: string[] = []

      if (action.payload.addRole) {
        data[index].roles.push(String(action.payload.addRole))
        dataRoleIndex = Array.from(new Set(data[index].roles))
      }

      if (action.payload.removeRole) {
        dataRoleIndex = data[index].roles.filter((item) => item !== action.payload.removeRole)
      }

      state.data[index].roles = [...dataRoleIndex]
    },
  },
})

export const { updatePoolsData, getAddressActive, updateErc20Balance, setRoleForPoolAddress } = poolsSlice.actions
export default poolsSlice.reducer
