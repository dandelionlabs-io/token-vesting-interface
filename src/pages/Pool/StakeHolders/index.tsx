import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers, utils } from 'ethers'
import { parse } from 'papaparse'
import React, { useRef, useState } from 'react'
import styled from 'styled-components/macro'

import ERC20 from '../../../abis/Erc20'
import Vesting from '../../../abis/Vesting'
import IconCDRED from '../../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../../assets/svg/icon/icon-dandelion-eth.svg'
import ModalLoading, { DataModalLoading } from '../../../components/Modal/ModalLoading'
import ModalSuccess, { DataModalSuccess } from '../../../components/Modal/ModalSuccess'
import SidebarMenu from '../../../components/SidebarMenu'
import { useLoadingModalToggle, useModalOpen, useSuccessModalToggle } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/reducer'
const address = window.localStorage.getItem('address')

interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}
const dataETH: TypeItemInfo = {
  heading: 'ETH Balance',
  amount: 0,
  widthIcon: '28px',
  heightIcon: '39px',
  SrcImageIcon: IconETH,
}
const dataCDRED: TypeItemInfo = {
  heading: 'CDRED Balance',
  amount: 0,
  widthIcon: '39px',
  heightIcon: '29px',
  SrcImageIcon: IconCDRED,
}

const StakeHolder = () => {
  const hiddenFileInput = useRef<any>(null)
  const [list, setList] = useState<any>([])
  const [successButton, setSuccessButton] = useState<any>(false)
  const [amount, setAmount] = useState<any>(0)
  const [addressList, setAddressList] = useState<any>([])
  const [amountList, setAmountList] = useState<any>([])
  const address = window.localStorage.getItem('address')
  const toggleSuccessModal = useSuccessModalToggle()
  const toggleLoadingModal = useLoadingModalToggle()
  const succesModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
  const loadingModalOpen = useModalOpen(ApplicationModal.POPUP_LOADING)

  const dataModalSuccess: DataModalSuccess = {
    type: 'stakeholder',
    amount,
  }
  const dataModalLoading: DataModalLoading = {
    type: 'loading',
  }
  const handleChange = (e: any, drop: any) => {
    let fileUploaded
    setAmount(0)
    e.type === 'drop' ? (fileUploaded = e.dataTransfer.files) : (fileUploaded = e.target.files)
    Array.from(fileUploaded).forEach(async (file: any) => {
      const content = await file.text()
      const result = parse(content, { header: true })
      const arrAddress: { address: any }[] = []
      const arrAmount: { amnt: any }[] = []
      result.data.map((item: any, index: any) => {
        if (index == result.data.length - 1) {
          return
        }

        const exist = blacklisted(item.address, blacklist)
        if (!exist && item.address && item.amount) {
          arrAddress.push(item.address)
          const amountttt: any = utils.parseEther(item.amount)
          arrAmount.push(amountttt)
          console.log(arrAddress)
          console.log(arrAmount)

          setAmount((existing: any) => existing + parseInt(item.amount))
          setAddressList(arrAddress)
          setAmountList(arrAmount)
        }
      })

      setList([...result.data])
    })
    const fileName = fileUploaded[0].name

    if (hiddenFileInput) {
      hiddenFileInput.current.innerText = fileName ? `${fileName}...` : `${fileUploaded.lenght} file selected`
    }
  }

  const blacklist = ['943sAx0x7589E9d1fF1Bcb7Fce92BFVs4CC']

  const blacklisted = (item: any, list: any) => {
    return list.includes(item)
  }

  const handleApproval = async () => {
    toggleLoadingModal()

    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(
      process.env.REACT_APP_TOKEN_ADDRESS || '',
      ERC20,
      web3Provider.getSigner()
    )

    const tx = await vestingInstance.approve(address, utils.parseEther(amount.toString())).catch((e: any) => {
      console.log(e)
    })

    tx?.wait().then(() => {
      setSuccessButton(true)
      toggleLoadingModal()
    })
  }
  const handleAdd = async () => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(address || '', Vesting, web3Provider.getSigner())

    const tx = await vestingInstance.addTokenGrants(addressList, amountList).catch((e: any) => {
      console.log(e)
    })

    tx?.wait().then(() => {
      toggleSuccessModal()
    })
    setList([])
    setAmount(0)
  }

  return (
    <>
      <SidebarMenu />
      <div>
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
                    handleChange(e, false)
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
                    handleChange(e, true)
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
              {list.map((item: any, index: any) => {
                const exist = blacklisted(item.address, blacklist)
                if (index == list.length - 1) {
                  return
                } else {
                  return (
                    <ListContainer key={index} justify="space-between">
                      <ListSpan color={exist ? '#5F5F5F' : 'white'}> {item.address}</ListSpan>
                      <ListSpan color={exist ? '#5F5F5F' : 'white'}>{item.amount}</ListSpan>
                    </ListContainer>
                  )
                }
              })}
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
                isOpen={succesModalOpen}
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
      </div>
    </>
  )
}
const CustomButton = styled.button<{ color?: string; background?: string }>`
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  margin-top: 30px;
  padding: 8px 0px;
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
const ReturnLink = styled.div<{ fontsize?: string; color?: string; fontweight?: string }>`
  color: ${(props) => props.color};
  font-weight: ${(props) => (props.fontweight ? props.fontweight : '200')};
  font-size: ${(props) => props.fontsize};
  line-height: 28px;
  margin: 15px 0;
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
const ListContainer = styled.div<{ border?: boolean; justify?: string }>`
  padding: 10px;
  border-bottom: ${({ border }) => (border ? 'none' : '1px solid #00316f')};
  color: white;
  display: flex;
  justify-content: ${(props) => props.justify};
  align-item: center;
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
  // display: flex;
  // justify-content: space-between;
`
const BlockWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`
const BlockChartList = styled.div`
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
`
const BlockChartItem = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 8px;
  padding-right: 8px;
`
export default StakeHolder
