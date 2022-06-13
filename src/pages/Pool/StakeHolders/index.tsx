import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers, utils } from 'ethers'
import { parse } from 'papaparse'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import ERC20 from '../../../abis/Erc20'
import Vesting from '../../../abis/Vesting'
import Api from '../../../api'
import GoBack from '../../../components/GoBack'
import ModalLoading, { DataModalLoading } from '../../../components/Modal/ModalLoading'
import ModalSuccess, { DataModalSuccess } from '../../../components/Modal/ModalSuccess'
import {
  useCloseModal,
  useLoadingModalToggle,
  useModalOpen,
  useSuccessModalToggle,
} from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/reducer'
import { useAppDispatch } from '../../../state/hooks'
import { updateListStateHolder } from '../../../state/pools/reducer'
import { typesPoolPage } from '../index'

const StakeHolder = () => {
  const hiddenFileInput = useRef<any>(null)
  const [list, setList] = useState<any>([])
  const [successButton, setSuccessButton] = useState<any>(false)
  const [blackList, setBlackList] = useState<string[]>([])

  const [amount, setAmount] = useState<any>(0)
  const [addressList, setAddressList] = useState<any>([])
  const [amountList, setAmountList] = useState<any>([])
  const poolAddress = window.localStorage.getItem('address')
  const toggleSuccessModal = useSuccessModalToggle()
  const toggleLoadingModal = useLoadingModalToggle()
  const closeModal = useCloseModal()
  const successModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
  const loadingModalOpen = useModalOpen(ApplicationModal.POPUP_LOADING)

  const dispatch = useAppDispatch()
  const history = useHistory()

  const dataModalSuccess: DataModalSuccess = {
    type: 'stakeholder',
    amount,
  }
  const dataModalLoading: DataModalLoading = {
    type: 'loading',
  }

  const handleChange = (e: any) => {
    let fileUploaded
    setAmount(0)
    e.type === 'drop' ? (fileUploaded = e.dataTransfer.files) : (fileUploaded = e.target.files)
    Array.from(fileUploaded).forEach(async (file: any) => {
      const content = await file.text()
      const result = parse(content, { header: true })
      const arrAddress: { address: string }[] = []
      const arrAmount: { amount: string }[] = []

      const dataFiles = result.data.map((item: any) => ({
        ...item,
        isBlackList: blackList.includes(item?.address),
      }))

      setList(dataFiles)
      dispatch(updateListStateHolder(dataFiles))

      dataFiles.forEach((item: any, index: any) => {
        if (index === result.data.length - 1) {
          return
        }

        if (item.address && item.amount) {
          arrAddress.push(item.address)
          if (!item.isBlackList) {
            const amounts: any = utils.parseEther(item.amount)
            arrAmount.push(amounts)
            setAmount((existing: number) => existing + parseInt(item.amount))
          }

          setAddressList(arrAddress)
          setAmountList(arrAmount)
        }
      })
    })
    const fileName = fileUploaded[0].name

    if (hiddenFileInput) {
      hiddenFileInput.current.innerText = fileName ? `${fileName}...` : `${fileUploaded.lenght} file selected`
    }
  }

  const handleApproval = async () => {
    if (!poolAddress) {
      window.localStorage.setItem('typePoolPage', typesPoolPage.CREATE_POOL)
      history.push({ pathname: 'pool' })
      return
    }

    toggleLoadingModal()

    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const ERC20Instance = new ethers.Contract(
      process.env.REACT_APP_TOKEN_ADDRESS || '',
      ERC20,
      web3Provider.getSigner()
    )

    const tx = await ERC20Instance.approve(poolAddress, utils.parseEther(amount.toString())).catch((e: any) => {
      console.log(e)
    })

    tx?.wait().then(() => {
      setSuccessButton(true)
      closeModal()
    })
  }

  const handleAdd = async () => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)
    const vestingInstance = new ethers.Contract(poolAddress || '', Vesting, web3Provider.getSigner())
    const tx = await vestingInstance.addTokenGrants(addressList, amountList).catch((e: any) => {
      console.log(e)
    })

    toggleLoadingModal()

    tx?.wait().then(() => {
      toggleSuccessModal()
      setList([])
      setAmount(0)

      setTimeout(() => {
        closeModal()

        window.localStorage.setItem('typePoolPage', !poolAddress ? typesPoolPage.CREATE_POOL : typesPoolPage.EDIT)
        history.push({ pathname: `pool` })
      }, 2000)
    })
  }

  useEffect(() => {
    const urlBlackList = `${process.env.REACT_APP_BASE_URL}/${poolAddress}/blacklist`
    ;(async () => {
      const list: string[] = await Api.get(urlBlackList)
      setBlackList(list)
    })()
  }, [poolAddress])

  return (
    <>
      <GoBack
        textNameBack={`Go back`}
        pageBack="pool"
        typePage={poolAddress ? typesPoolPage.EDIT : typesPoolPage.CREATE_POOL}
      />
      <BlockWrapper>
        <EmptyContainer width="100%">
          <Heading>Add Stakeholders(s)</Heading>

          <ListContainer justify="space-between">
            <HeadSpan fontsize="16px" fontweight="bold">
              Upload csv file
            </HeadSpan>
            <HeadSpan>
              <FileInput
                type="file"
                name="file"
                id="file"
                ref={hiddenFileInput}
                onChange={(e) => {
                  handleChange(e)
                }}
                accept=".csv"
                required
              />
              <FileLable
                htmlFor="file"
                ref={hiddenFileInput}
                onDragEnter={() => {
                  hiddenFileInput.current.innerText = 'Drop file here.'
                }}
                onDragLeave={() => {
                  hiddenFileInput.current.innerText = ' Drag or choose file'
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  hiddenFileInput.current.innerText = 'Drop file here!'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleChange(e)
                }}
              >
                Drag or choose file
              </FileLable>

              {/* <i className="fa fa-cloud-upload" /> Drag or choose file */}
            </HeadSpan>
          </ListContainer>
          <ListContainer justify="space-between">
            <HeadSpan fontsize="16px" fontweight="bold">
              Address
            </HeadSpan>

            <HeadSpan>Amount</HeadSpan>
          </ListContainer>
          <EmptyWrapper>
            {list.map((item: any, index: any) => (
              <ListContainer key={index} justify="space-between">
                <ListSpan color={item.isBlackList ? '#5F5F5F' : 'white'}> {item.address}</ListSpan>
                <ListSpan color={item.isBlackList ? '#5F5F5F' : 'white'}>
                  {item.isBlackList ? '-' : item.amount}
                </ListSpan>
              </ListContainer>
            ))}
          </EmptyWrapper>
          <ListContainer border={true} justify="space-between">
            <HeadSpan fontsize="16px" color="white">
              Token balance to lock
            </HeadSpan>
            <HeadSpan fontsize="20px" color="#FAA80A" fontweight="700">
              {amount}
            </HeadSpan>
          </ListContainer>
          <ListContainer border={true} justify="flex-end">
            {successButton ? (
              <CustomButton background="#FAA80A" color="#012553" onClick={handleAdd}>
                Add
              </CustomButton>
            ) : (
              <CustomButton background="#FAA80A" color="#012553" onClick={handleApproval}>
                Approve
              </CustomButton>
            )}
            <ModalSuccess
              isOpen={successModalOpen}
              onDimiss={toggleSuccessModal}
              data={dataModalSuccess}
            ></ModalSuccess>
            <ModalLoading
              isOpen={loadingModalOpen}
              onDimiss={toggleLoadingModal}
              data={dataModalLoading}
            ></ModalLoading>
          </ListContainer>
        </EmptyContainer>
      </BlockWrapper>
    </>
  )
}
const CustomButton = styled.button<{ color?: string; background?: string }>`
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  margin-top: 30px;
  padding: 8px 0;
  width: 180px;
  height: 36px;
  border-radius: 8px;
  border: transparent;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`
const ListSpan = styled.span<{ fontsize?: string; color?: string; fontweight?: string }>`
  margin-bottom: 10px;
  color: ${(props) => props.color};
  font-weight: ${(props) => (props.fontweight ? props.fontweight : '200')};
  font-size: ${(props) => props.fontsize};
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const FileLable = styled.label`
  width: 438px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.5);
    color: red;
  }
  &:focus {
    background-color: red;
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
  }
`
const FileInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
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
const ListContainer = styled.div<{ border?: boolean; justify?: string }>`
  padding: 10px;
  border-bottom: ${({ border }) => (border ? 'none' : '1px solid #00316f')};
  color: white;
  display: flex;
  justify-content: ${(props) => props.justify};
  align-items: center;
`

const EmptyContainer = styled.div<{ width?: string }>`
  border-radius: 16px;
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: column;
  min-height: 460px;
  box-sizing: border-box;
  width: ${(props) => props.width};
  min-width: 400px;
`
const EmptyWrapper = styled.div`
  padding-bottom: 100px;
  border-bottom: 1px solid #00316f;
`
const BlockWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`
export default StakeHolder
