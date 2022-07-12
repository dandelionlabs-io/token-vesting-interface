import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers } from 'ethers'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import IconOxy from '../../../../src/components/Icons/IconOxy'
import Vesting from '../../../abis/vesting.json'
import Api from '../../../api'
import AddStake from '../../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconTableEdit from '../../../assets/svg/icon/icon-dandelion-edit.svg'
import IconSort from '../../../assets/svg/icon/icon-dandelion-polygon-down.svg'
import SwapManage from '../../../assets/svg/icon/icon-dandelion-swap.svg'
import User from '../../../assets/svg/icon/icon-user-profile.svg'
import BlockFeatureUser from '../../../components/BlockFeatureUser'
import GoBack from '../../../components/GoBack'
import ModalSuccess from '../../../components/Modal/ModalSuccess'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { AppState } from '../../../state'
import { useCloseModal, useModalOpen, useSuccessModalToggle } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/reducer'
import { useAppDispatch, useAppSelector } from '../../../state/hooks'
import { IPoolsData, updateListStateHolder } from '../../../state/pools/reducer'
import { ethBalance, shortenAddress } from '../../../utils'
import { typesPoolPage } from '../index'

const IconUser = {
  SrcImageIcon: User,
  widthIcon: '16px',
  heightIcon: '15px',
}

const IconAddStake = {
  SrcImageIcon: AddStake,
  widthIcon: '16px',
  heightIcon: '15px',
}
type TypeColumns = {
  key?: string
  name?: string
}
const columns: TypeColumns[] = [
  { key: 'address', name: 'Address' },
  { key: 'locked', name: 'Locked' },
  { key: 'claimed', name: 'Claimed' },
]
const IconSwapManage = {
  SrcImageIcon: SwapManage,
  widthIcon: '16px',
  heightIcon: '15px',
}

const PoolDetails = () => {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const poolAddress = window.localStorage.getItem('address')
  const typePage = window.localStorage.getItem('typePoolPage')

  useEffect(() => {
    if (!poolAddress) {
      history.push({ pathname: `dashboard` })
      return
    }
  }, [history, poolAddress])

  const toggleSuccessModal = useSuccessModalToggle()
  const closeModal = useCloseModal()
  const dispatch = useAppDispatch()

  const successModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
  const poolsData = useAppSelector((state: AppState) => state.pools)
  const stakeholdersData = useAppSelector((state: AppState) => state.pools.listAddStakeholders)
  const [data, setData] = useState<any>({})
  const [namePoolAddress, setNamePoolAddress] = useState<string>('')
  const [stakeholders, setStakeholders] = useState<Array<any>>([])
  const [historyClaim, setHistoryClam] = useState<Array<any>>([])
  const [claimedPercent, setClaimedPercent] = useState<number>(0)
  const [claimablePercent, setClaimablePercent] = useState<number>(0)

  const handleSortHistoryClaim = useCallback((data: Array<any>) => {
    if (!data || !data.length) {
      return
    }
    const dataSort: Array<any> = [...data]
    if (increaseDate.current) {
      dataSort.sort((firstItem, secondItem) => firstItem.timestamp - secondItem.timestamp)
    } else {
      dataSort.sort((firstItem, secondItem) => secondItem.timestamp - firstItem.timestamp)
    }

    increaseDate.current = !increaseDate.current

    setHistoryClam(dataSort)
  }, [])
  useEffect(() => {
    if (!account || !typePage) {
      return
    }
    ;(async () => {
      try {
        if (typePage === typesPoolPage.CLAIM) {
          const url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_NETWORK}/${poolAddress}/claims/${account}`
          const dataHis: any = await Api.get(url)
          const dataHisClone: Array<any> = [...dataHis]

          let amounts = data.amount

          for (let i = dataHisClone.length - 1; i > -1; i--) {
            amounts = amounts - ethBalance(dataHisClone[i].amountClaimed)
            dataHisClone[i].remain = amounts
          }

          handleSortHistoryClaim(dataHisClone)
        }

        if (typePage === typesPoolPage.EDIT && stakeholdersData.length < 1) {
          const url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_NETWORK}/${poolAddress}/stakeholders`
          const dataStakeholders: Array<any> = await Api.get(url)
          dispatch(updateListStateHolder([...dataStakeholders]))
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [data, account, typePage, poolAddress, stakeholdersData, handleSortHistoryClaim, dispatch])

  useEffect(() => {
    setStakeholders(stakeholdersData)
  }, [stakeholdersData])

  const increaseDate = useRef<boolean>(false)
  const alphabet = useRef<boolean>(false)

  const handleClaim = async () => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(poolAddress || '', Vesting, web3Provider.getSigner())

    const tx = await vestingInstance
      .claimVestedTokens()
      .then(() => {
        toggleSuccessModal()
      })
      .catch((e: any) => {
        console.log(e)
      })
      .finally(() => {
        setTimeout(function () {
          closeModal()
        }, 3000)
      })

    tx?.wait().then(() => window.location.reload())
  }

  const handleRedirectPool = (typePoolPage: string, addressWallet?: string) => {
    window.localStorage.setItem('typePoolPage', typePoolPage)
    addressWallet && window.localStorage.setItem('addressWallet', addressWallet)
    history.push({ pathname: `/pool` })
  }

  const handleSortStakeholders = useCallback((data: Array<any>) => {
    if (!data || !data.length) {
      return
    }

    const dataStakeholder = data.filter((item) => !!item.amountlocked)

    let dataSort = [...dataStakeholder].map((item, index) => ({
      address: item.newOwner ? item.newOwner : item.address,
      amountClaimed: item.amountClaimed,
      amountlocked: item.amountlocked,
    }))
    dataSort = dataSort.sort((prev: any, next: any) => {
      const prevName = prev.address.toLowerCase()
      const nextName = next.address.toLowerCase()

      if (alphabet.current) {
        if (prevName < nextName) {
          return -1
        }
        if (prevName > nextName) {
          return 1
        }
      } else {
        if (prevName < nextName) {
          return 1
        }
        if (prevName > nextName) {
          return -1
        }
      }

      return 0
    })

    alphabet.current = !alphabet.current
    setStakeholders(dataSort)
  }, [])

  useEffect(() => {
    if (!poolsData.data?.length || !poolAddress) {
      return
    }

    const obj = poolsData.data.find((o: IPoolsData) => o.address === poolAddress)
    if (!obj) {
      return
    }
    setNamePoolAddress(obj.name)
    setData(obj)
    if (obj.amount <= 0) {
      setClaimedPercent(0)
      setClaimablePercent(0)
    } else {
      setClaimedPercent((obj.claimed / obj.amount) * 100)
      setClaimablePercent((obj.claimable / obj.amount) * 100)
    }
  }, [poolAddress, poolsData?.data])

  return (
    <>
      <PoolDetailHead>
        <PoolAddressName>{namePoolAddress}</PoolAddressName>
        <GoBack textNameBack={`Go back`} pageBack="dashboard" typePage="" />
      </PoolDetailHead>
      <BlockWrapper>
        <EmptyContainer>
          <Heading>Detail</Heading>

          <ListContainer>
            <HeadSpan fontsize="16px" fontweight="bold">
              Contract Address
            </HeadSpan>
            <HeadSpan>
              <HeadSpan fontsize="16px">{shortenAddress(poolAddress || '')}</HeadSpan> <HeadSpan></HeadSpan>
            </HeadSpan>
          </ListContainer>
          <ListContainer>
            <HeadSpan fontsize="16px" fontweight="bold">
              Lock Start Time
            </HeadSpan>
            <HeadSpan>
              <HeadSpan fontsize="16px">{moment(data.start).format('MMM DD, YYYY')}</HeadSpan>
            </HeadSpan>
          </ListContainer>
          <ListContainer>
            <HeadSpan fontsize="16px" fontweight="bold">
              Lock End Time
            </HeadSpan>
            <HeadSpan>
              <HeadSpan fontsize="16px">{moment(data.end).format('MMM DD, YYYY')}</HeadSpan>
            </HeadSpan>
          </ListContainer>
          <ListContainer>
            <HeadSpan fontsize="16px" fontweight="bold">
              Total Locked Amount
            </HeadSpan>
            <HeadSpan>
              <HeadSpan fontsize="16px">{data.remain && data.remain.toFixed(3)}</HeadSpan> <HeadSpan></HeadSpan>
            </HeadSpan>
          </ListContainer>
          <ProgressDiv>
            <HeadSpan fontsize="16px" fontweight="bold" color="white">
              Progress detail
            </HeadSpan>
            <ProgressBar>
              <ProgressInner width={`${claimedPercent}`} background="#FAA80A"></ProgressInner>
              <ProgressInner width={`${claimablePercent}`} background="#18aa00"></ProgressInner>
            </ProgressBar>
            <ProgressBarContent>
              <HeadSpan fontsize="14px" fontweight="400" color="#FAA80A" style={{ margin: '0' }}>
                Claimed <SpanIcon background="#FAA80A"></SpanIcon>
              </HeadSpan>
              <HeadSpan fontsize="14px" fontweight="400" color="#18AA00" style={{ margin: '0' }}>
                Claimable <SpanIcon background="#18AA00"></SpanIcon>
              </HeadSpan>
              <HeadSpan fontsize="14px" fontweight="400" color="#868B90 " style={{ margin: '0' }}>
                Remaining balance <SpanIcon background="#868B90"></SpanIcon>
              </HeadSpan>
              {typePage === typesPoolPage.CLAIM && <ClaimButton onClick={handleClaim}>Claim</ClaimButton>}
            </ProgressBarContent>
          </ProgressDiv>
          {typePage === typesPoolPage.EDIT && (
            <DivActionUser>
              {data.roles?.includes('ADMIN') ? (
                <div onClick={() => handleRedirectPool(typesPoolPage.TRANSFER_OWNER)}>
                  <BlockFeatureUser dataImage={IconUser} name={'Transfer Owner'} />
                </div>
              ) : (
                <div></div>
              )}
              {data.roles?.includes('ADMIN') && (
                <div onClick={() => handleRedirectPool(typesPoolPage.ASSIGN_MANAGER)}>
                  <BlockFeatureUser dataImage={IconSwapManage} name={'Add/Remove Manager'} />
                </div>
              )}
            </DivActionUser>
          )}
        </EmptyContainer>

        {typePage === typesPoolPage.EDIT && (
          <EmptyContainer>
            <Heading>Stakeholders</Heading>
            <DivTableBox>
              <Table>
                <thead>
                  <tr>
                    {columns.map((item, index) => {
                      return (
                        <TableTh key={item.key} data-head={item.key}>
                          {item.name}
                          {!index && (
                            <DivIconSort
                              onClick={() => handleSortStakeholders(stakeholders)}
                              reverse={alphabet.current}
                            >
                              <IconOxy SrcImageIcon={IconSort} widthIcon={'12px'} heightIcon={'12px'} />
                            </DivIconSort>
                          )}
                        </TableTh>
                      )
                    })}
                  </tr>
                </thead>
                {stakeholders && !!stakeholders.length && (
                  <tbody>
                    {stakeholders?.map((item: any, index: number) => {
                      return (
                        item &&
                        item.address !== '' && (
                          <tr key={index}>
                            <td>
                              <DivNameBox>
                                <AddressWallet>{shortenAddress(item.address)} </AddressWallet>
                              </DivNameBox>
                            </td>

                            <td>
                              <span>{item?.amountlocked ? (parseFloat(item.amountlocked) / 1e18).toFixed(3) : 0}</span>
                            </td>
                            <td>
                              <span>
                                {item?.amountClaimed ? (parseFloat(item.amountClaimed) / 1e18).toFixed(3) : 0}
                              </span>
                            </td>

                            <td>
                              <DivAct>
                                {data.roles && (data.roles.includes('OPERATOR') || data.roles.includes('ADMIN')) && (
                                  <DivIcon
                                    onClick={() => handleRedirectPool(typesPoolPage.EDIT_STAKEHOLDER, item.address)}
                                  >
                                    <IconOxy SrcImageIcon={IconTableEdit} widthIcon={'20px'} heightIcon={'20px'} />
                                  </DivIcon>
                                )}
                              </DivAct>
                            </td>
                          </tr>
                        )
                      )
                    })}
                  </tbody>
                )}
              </Table>
            </DivTableBox>
            {stakeholders && !stakeholders.length && <Notification>No data to show !</Notification>}

            {(data.roles?.includes('ADMIN') || data.roles?.includes('OPERATOR')) && (
              <div onClick={() => handleRedirectPool(typesPoolPage.ADD_STAKEHOLDER)}>
                <BlockFeatureUser dataImage={IconAddStake} name={'Add Stakeholder(s)'} />
              </div>
            )}
          </EmptyContainer>
        )}
        {typePage === typesPoolPage.CLAIM && (
          <EmptyContainer>
            <Heading>History of Claims</Heading>
            <ListContainer>
              <HeadSpan fontsize="16px" fontweight="bold">
                <span>Date</span>
                <DivIconSort onClick={() => handleSortHistoryClaim(historyClaim)} reverse={increaseDate.current}>
                  <IconOxy SrcImageIcon={IconSort} widthIcon={'12px'} heightIcon={'12px'} />
                </DivIconSort>
              </HeadSpan>
              <HeadSpan fontsize="16px">Claimed Amt.</HeadSpan>
              <HeadSpan>Remaining</HeadSpan>
            </ListContainer>

            {historyClaim &&
              !!historyClaim.length &&
              historyClaim.map((item: any, i: number) => (
                <ListContainer key={i}>
                  <HeadSpan fontsize="16px">{moment(item.timestamp * 1000).format('MMM DD YYYY HH:MM')}</HeadSpan>
                  <HeadSpan fontsize="16px">{(parseFloat(item.amountClaimed) / 1e18).toFixed(3)}</HeadSpan>
                  <HeadSpan>{parseFloat(item.remain).toFixed(3)}</HeadSpan>
                </ListContainer>
              ))}
          </EmptyContainer>
        )}
      </BlockWrapper>
      <ModalSuccess isOpen={successModalOpen} onDimiss={toggleSuccessModal}></ModalSuccess>
    </>
  )
}

const PoolAddressName = styled.div`
  transition: transform 0.3s ease;
  margin: 20px auto 20px 60px;
  font-weight: bold;
  font-size: 24px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.white};
`

const AddressWallet = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.text8};
`
const Notification = styled.p`
  margin-bottom: 0;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  color: ${({ theme }) => theme.white};
  text-align: center;
  padding-top: 100px;
`
const DivTableBox = styled.div`
  margin-top: 8px;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead tr {
    border-bottom: 1px solid #00316f;
  }

  tbody tr {
    border-bottom: 1px dashed #00316f;
  }
  tbody tr td {
    color: ${({ theme }) => theme.white};
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-align: right;
    padding: 20px 8px;
  }
`
const TableTh = styled.th<{ width?: string }>`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  color: ${({ theme }) => theme.white};
  padding: 20px 8px;
  text-align: right;
  white-space: nowrap;
  &:first-child {
    text-align: left;
  }
  ${({ width }) =>
    width &&
    css`
      width: ${width};
      min-width: ${width};
    `}
  &[data-head='claimed'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='remain'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='start'] {
    width: 130px;
    min-width: 130px;
  }
  &[data-head='end'] {
    width: 130px;
    min-width: 130px;
  }
  &:last-of-type {
    max-width: 130px;
    width: 120px;
  }
`
const DivNameBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`
const DivAct = styled.div`
  display: flex;
  justify-content: flex-end;
`
const DivIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 24px;
  position: relative;
  &:first-child {
    padding-left: 0;
    &::before {
      display: none;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12px;
    width: 1px;
    background-color: ${({ theme }) => theme.blue5};
  }
  & > span {
    cursor: pointer;
  }
`

const ClaimButton = styled.button`
  color: ${({ theme }) => theme.white};
  background: #18aa00;
  margin-top: 30px;
  padding: 8px 0;
  width: 180px;
  height: 36px;
  border-radius: 8px;
  border: transparent;
  cursor: pointer;
`
const ProgressBarContent = styled.div`
  padding: 5px;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`
const ProgressDiv = styled.div`
  padding: 5px;
  margin-bottom: 15px;
`
const ProgressInner = styled.div<{ width?: string; background?: string }>`
  background: ${(props) => props.background};
  height: 100%;
  display: inline-block;

  width: ${(props) => props.width}%;
`
const ProgressBar = styled.div`
  display: flex;
  background: #868b90;
  height: 20px;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  margin: 10px 0;
`
const SpanIcon = styled.div<{ background?: string }>`
  background: ${(props) => props.background};
  width: 16px;
  height: 5px;
  border-radius: 12px;
  display: inline-block;
  margin-left: 5px;
`
const HeadSpan = styled.span<{ fontsize?: string; color?: string; fontweight?: string }>`
  margin-bottom: 10px;
  color: ${(props) => props.color};
  font-weight: ${(props) => (props.fontweight ? props.fontweight : '200')};
  font-size: ${(props) => props.fontsize};
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Heading = styled.h3`
  color: #faa80a;
  margin-bottom: 10px;
  font-size: 24px;
  line-height: 1.2;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 700;
  text-transform: unset;
`
const EmptyContainer = styled.div`
  border-radius: 16px;
  background-color: rgba(0, 20, 45, 0.2);
  border: solid 1px #002d64;
  backdrop-filter: blur(2px);
  box-shadow: 0px -6px 22px 5px rgba(0, 0, 0, 0.25), 0px 32px 40px -12px rgba(0, 0, 0, 0.65);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: column;
  min-height: 460px;
  box-sizing: border-box;
  width: 45%;
  min-width: 400px;

  & > div:last-child {
    margin-top: auto;
  }
`
const ListContainer = styled.div`
  margin-top: 5px !important;
  padding: 10px;
  border-bottom: 1px solid #00316f;
  color: white;
  display: flex;
  justify-content: space-between;
`
const BlockWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`
const DivActionUser = styled.div`
  display: flex;
  justify-content: space-between;
`
const DivIconSort = styled.div<{ reverse?: boolean }>`
  transform: ${(props) => (props.reverse ? 'rotate(180deg)' : 'rotate(0deg)')};
  margin-left: 10px;
  cursor: pointer;
  display: inline-block;
`

const PoolDetailHead = styled.div`
  display: flex;
  padding-right: 60px;
`
export default PoolDetails
