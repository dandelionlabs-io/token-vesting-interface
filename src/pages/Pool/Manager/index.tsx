import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers } from 'ethers'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import Vesting from '../../../abis/Vesting'
import Delete from '../../../assets/svg/icon/icon-dandelion-delete.svg'
import GoBack from '../../../components/GoBack'
import IconOxy from '../../../components/Icons/IconOxy'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { IPoolsData, RolePoolAddress, setRoleForPoolAddress, updateManagers } from '../../../state/pools/reducer'
import { typesPoolPage } from '../index'
const Manager = () => {
  const dispatch = useAppDispatch()
  const poolAddress = window.localStorage.getItem('address')
  const [valueAddress, setValueAddress] = useState<string>('')
  const [checkValue, setCheckValue] = useState<boolean>(false)
  const statePools: IPoolsData[] | null = useAppSelector((state) => state.pools).data
  const [listManagers, setListManagers] = useState<string[]>([])

  useEffect(() => {
    if (!poolAddress || !statePools) {
      return
    }
    const listManagers =
      statePools.filter((statePool: IPoolsData) => {
        return statePool.address === poolAddress
      })[0]?.managersAddress || []
    setListManagers(listManagers)
  }, [poolAddress, statePools])

  const handleChange = (e: any) => {
    const valueInput = e.target.value
    if (listManagers.includes(valueInput)) {
      setCheckValue(true)
    } else {
      setCheckValue(false)
    }
    setValueAddress(e.target.value)
  }
  const handleRemoveManager = async (itemManager: string) => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(poolAddress || '', Vesting, web3Provider.getSigner())
    vestingInstance
      .revokeRole(process.env.REACT_APP_ROLE_STATIC_ADDRESS, itemManager)
      .then(() => {
        dispatch(setRoleForPoolAddress({ poolAddress, removeRole: RolePoolAddress['OPERATOR'] }))
        dispatch(updateManagers({ poolAddress, itemManager, isRemove: true }))
        setValueAddress('')
      })
      .catch((e: string) => console.log(e))
  }
  const handleAddManager = async (itemManager: string | null) => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(poolAddress || '', Vesting, web3Provider.getSigner())

    vestingInstance
      .grantRole(process.env.REACT_APP_ROLE_STATIC_ADDRESS, itemManager)
      .then(() => {
        dispatch(setRoleForPoolAddress({ poolAddress, addRole: RolePoolAddress['OPERATOR'] }))
        dispatch(updateManagers({ poolAddress, itemManager, isRemove: false }))
        setValueAddress('')
      })
      .catch((e: string) => console.log(e))
  }
  return (
    <>
      <GoBack textNameBack="Go back to DandelionLabs" pageBack="pool" typePage={typesPoolPage.EDIT} />
      <DivWrapper>
        <HeadingBlock>Manager Address</HeadingBlock>
        <ManagerList>
          {listManagers?.map((itemManager: string) => {
            return (
              <ManagerItem key={itemManager}>
                <ManagerItemContent>
                  <ManagerItemAddress>{itemManager}</ManagerItemAddress>
                  <div onClick={() => handleRemoveManager(itemManager)}>
                    <IconOxy SrcImageIcon={Delete} heightIcon={'17px'} widthIcon={'17px'} />
                  </div>
                </ManagerItemContent>
              </ManagerItem>
            )
          })}
        </ManagerList>
        <DivAddManager>
          <InputControl
            type={'text'}
            placeholder={'New operator address'}
            onChange={(e) => handleChange(e)}
            value={valueAddress}
          />
          <ButtonAdd
            disabled={!valueAddress || checkValue}
            type={'button'}
            onClick={() => handleAddManager(valueAddress)}
          >
            Add
          </ButtonAdd>
        </DivAddManager>
      </DivWrapper>
    </>
  )
}
const DivWrapper = styled.div`
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px;
  border-radius: 16px;
`
const HeadingBlock = styled.h3`
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.25;
  padding-left: 8px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid ${({ theme }) => theme.blue7};
`
const ManagerList = styled.div`
  margin-bottom: 20px;
  min-height: 100px;
`
const ManagerItem = styled.div`
  padding: 20px 8px;
  border-bottom: 1px dashed ${({ theme }) => theme.blue7};
  &:last-of-type {
    border-bottom: 0;
  }
`
const ManagerItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    cursor: pointer;
  }
`
const ManagerItemAddress = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.214;
  margin-bottom: 0;
  color: ${({ theme }) => theme.white};
`
const DivAddManager = styled.div`
  padding: 20px 8px 0;
  border-top: 1px solid ${({ theme }) => theme.blue7};
  display: flex;
`
const InputControl = styled.input`
  background-color: ${({ theme }) => theme.bg8};
  border-radius: 8px;
  padding: 8px 20px;
  outline: none;
  border: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  width: 100%;
  color: ${({ theme }) => theme.white};
  ::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  :-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  ::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`
const ButtonAdd = styled.button`
  border-radius: 8px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;

  outline: none;
  border: none;
  width: 180px;
  padding: 8px;
  background-color: ${({ theme }) => theme.yellow1};
  color: ${({ theme }) => theme.blue6};
  cursor: pointer;
  margin-left: 32px;
  &[disabled] {
    background-color: ${({ theme }) => theme.bgButton};
    color: ${({ theme }) => theme.text12};
    cursor: default;
  }
`
export default Manager
