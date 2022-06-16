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

export interface IState {
  data: IPoolsData[]
  page?: number
  size?: number
  sort?: string
  typePool?: string
  totalPool?: number
  erc20Balance: number
  listAddStakeholders: IStakeholders[]
}

export interface IFiltersStatePool {
  page?: number
  size?: number
  sort?: string
  typePool?: string
  totalPool?: number
}

const initialState: IState = {
  data: [],
  page: 1,
  size: 8,
  sort: 'ASC',
  typePool: 'all',
  totalPool: 1,
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
    updatePoolsData(state: IState, action) {
      state.data = [...action.payload]
    },
    updateListStateHolder(state: IState, action) {
      state.listAddStakeholders = [...action.payload]
    },
    updateErc20Balance(state: IState, action) {
      state.erc20Balance = action.payload
    },
    setRoleForPoolAddress(state: IState, action) {
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
    updateManagers(state: IState, action) {
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

    updateFiltersStatePool(state: IState, action) {
      for (const key of Object.keys(action.payload)) {
        if (key === 'typePool') {
          state.typePool = action.payload.typePool
        }

        if (key === 'size') {
          state.page = action.payload.size
        }

        if (key === 'page') {
          state.page = action.payload.page
        }

        if (key === 'sort') {
          state.sort = action.payload.sort
        }

        if (key === 'totalPool') {
          state.totalPool = action.payload.totalPool
        }
      }
    },
  },
})

export const {
  updatePoolsData,
  updateErc20Balance,
  setRoleForPoolAddress,
  updateManagers,
  updateListStateHolder,
  updateFiltersStatePool,
} = poolsSlice.actions
export default poolsSlice.reducer
