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
  managersAddress: string[]
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
    updateManagers(state: IInitialState, action) {
      const { address, itemManager, isRemove } = action.payload
      const index: number = state.data.findIndex((o: any) => o.address === address)
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
    sortPoolsData(state: IInitialState, action) {
      let dataSort = [...action.payload]
      dataSort = dataSort.sort((prev: any, next: any) => {
        const prevName = prev.name.toLowerCase()
        const nextName = next.name.toLowerCase()
        if (prevName < nextName) {
          return -1
        }
        if (prevName > nextName) {
          return 1
        }
        return 0
      })
      state.data = [...dataSort]
    },
  },
})

export const {
  updatePoolsData,
  getAddressActive,
  updateErc20Balance,
  setRoleForPoolAddress,
  updateManagers,
  sortPoolsData,
} = poolsSlice.actions
export default poolsSlice.reducer
