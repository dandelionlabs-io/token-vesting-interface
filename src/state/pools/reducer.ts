import { createSlice } from '@reduxjs/toolkit'

export interface IStakeholders {
  address: string
  amount: string
}

export interface IPoolsData {
  name: string
  address: string
  amount: number
  claimable: number
  claimed: any
  remain: any
  start: number | null
  end: number | null
  statusClaim?: any
  erc20Balance: number
  roles: string[]
  managersAddress: string[]
  blackList: string[]
}

export interface IInitialState {
  data: IPoolsData[]
  erc20Balance: number
  listAddStakeholders: IStakeholders[]
}

const initialState: IInitialState = {
  data: [],
  erc20Balance: 0,
  listAddStakeholders: [],
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
    updateListStateHolder(state: IInitialState, action) {
      const listOfStakeholders = [...state.listAddStakeholders]
      state.listAddStakeholders = [...listOfStakeholders, ...action.payload]
    },
    updateErc20Balance(state: IInitialState, action) {
      state.erc20Balance = action.payload
    },
    setRoleForPoolAddress(state: IInitialState, action) {
      const index: number = state.data.findIndex((o: any) => o.address === action.payload.address)
      if (index < 0) {
        return
      }
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
    updateManagers(state: IInitialState, action) {
      const { address, itemManager, isRemove } = action.payload
      const index: number = state.data.findIndex((o: any) => o.address === address)
      if (index < 0) {
        return
      }
      const data: IPoolsData[] = [...state.data] || []
      let dataManagerIndex: string[] = []
      if (isRemove) {
        dataManagerIndex = data[index].managersAddress.filter((item) => {
          return item !== itemManager
        })
      } else {
        data[index].managersAddress.push(String(itemManager))
        dataManagerIndex = Array.from(new Set(data[index].managersAddress))
      }

      state.data[index].managersAddress = [...dataManagerIndex]
    },
  },
})

export const { updatePoolsData, updateErc20Balance, setRoleForPoolAddress, updateManagers, updateListStateHolder } =
  poolsSlice.actions
export default poolsSlice.reducer
