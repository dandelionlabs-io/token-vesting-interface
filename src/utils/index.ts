import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { utils } from 'ethers'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)

  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export const calcTokens = async (oxyInstance: any, projectId: string, account: string | null, amount: number) => {
  const idsToSend: Array<string> = []
  const amountsToSend: Array<number> = []

  const tokens = await oxyInstance.methods.getTokensOfProject(projectId).call()

  const accounts = tokens.map((el: string) => {
    return account
  })

  const tokenAmounts: string[] = await oxyInstance.methods.balanceOfBatch(accounts, tokens).call()

  let amountRemain = amount

  tokenAmounts.every(async (tokenBalance, i) => {
    if (amountRemain <= 0) return false

    const balance = parseFloat(tokenBalance)

    if (balance === 0) return false

    if (balance < amountRemain) {
      idsToSend.push(tokens[i])
      amountsToSend.push(balance)
      amountRemain -= balance
      return true
    } else {
      idsToSend.push(tokens[i])
      amountsToSend.push(amountRemain)
      amountRemain -= balance
      return false
    }
  })

  return [idsToSend, amountsToSend]
}

// account is not optional
function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(library: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export const ethBalance = (balance: any) => {
  if (!balance) return 0
  const result = parseInt(utils.formatEther(balance)) / 1e18

  return result
}
