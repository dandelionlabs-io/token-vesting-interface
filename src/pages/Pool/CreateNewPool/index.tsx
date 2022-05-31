import 'react-datepicker/dist/react-datepicker.css'

import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers, utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'

import ERC20 from '../../../abis/Erc20'
import Factory from '../../../abis/Factory'
import Vesting from '../../../abis/Vesting'
import IconBin from '../../../assets/svg/icon/icon-dandelion-bin.svg'
import IconCalendar from '../../../assets/svg/icon/icon-dandelion-calender.svg'
import IconUploadFile from '../../../assets/svg/icon/icon-dandelion-upload-file.svg'
import IconPlus from '../../../assets/svg/icon/icon-plus.svg'
import { BaseButton } from '../../../components/Button'
import IconOxy from '../../../components/Icons/IconOxy'
import { useAppSelector } from '../../../state/hooks'
import { IStakeholders } from '../../../state/pools/reducer'
import { typesPoolPage } from '../index'
import TitleOptionNewPool from '../TitleOptionNewPool'

interface fileImage {
  name: string
  type: string
  size: number
  src: any
}
const CreateNewPool = () => {
  const history = useHistory()
  const [name, setName] = useState<string>('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [fileImage, setFileImage] = useState<fileImage[]>([])
  const [showInputFile, setShowInputFile] = useState<boolean>(false)

  const [isDisable, setIsDisable] = useState<boolean>(false)

  const listAddStakeholders: IStakeholders[] = useAppSelector((state) => state.pools)?.listAddStakeholders

  const onDragEnter = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const onDragOver = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleStartDateChange = (date: any) => setStartDate(date)
  const handleEndDateChange = (date: any) => setEndDate(date)

  const handleFileUpload = (files: any) => {
    const imageArray: fileImage[] = []
    for (const file of files) {
      if (file && file.type.split('/')[0] === 'image') {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          const fileObj: fileImage = {
            name: file.name,
            type: file.type,
            size: file.size,
            src: reader.result,
          }
          imageArray.push(fileObj)
          setFileImage((prevFileImage: fileImage[]) => {
            return [...prevFileImage, ...imageArray]
          })
        })
      }
    }
    setShowInputFile(false)
  }
  const handleChangeUploadImage = (event: any) => {
    const files = event.target.files
    handleFileUpload(files)
  }
  const handleDropFile = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    const dt = event.dataTransfer
    const files = dt.files
    handleFileUpload(files)
  }
  const handleDeleteImage = (event: any) => {
    event.preventDefault()
    const target = event.target.parentElement
    const targetIndex = target.dataset.imgindex
    setFileImage((prevFileImage: fileImage[]) => {
      const fileImageSlice = fileImage.splice(targetIndex, 1)
      return [...prevFileImage, ...fileImageSlice]
    })
    setShowInputFile(true)
  }

  const handleGetName = (e: any) => {
    setName(String(e.target.value))
  }

  const handleAddStakeholders = () => {
    window.localStorage.setItem('typePoolPage', typesPoolPage.ADD_STAKEHOLDER)
    history.push({ pathname: `pool` })
  }

  const handleCreatePool = async () => {
    if (!startDate || !endDate || !name) {
      return
    }

    const start = parseInt(String(startDate.getTime() / 1000))
    const duration = parseInt(String((endDate.getTime() - startDate.getTime()) / 1000))

    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const amount = listAddStakeholders.reduce((prev, next) => prev + parseInt(next.amount), 0)
    const amountList: string[] = []
    const addressList: string[] = []

    listAddStakeholders.forEach((item: any, index: any) => {
      if (item.address && item.amount) {
        addressList.push(item.address)
        const amount: any = utils.parseEther(item.amount)
        amountList.push(amount)
      }
    })

    const contract = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS || '',
      Factory,
      web3Provider.getSigner()
    )

    const tx = await contract
      .createFullPool(name, process.env.REACT_APP_TOKEN_ADDRESS, start, duration)
      .catch((e: any) => {
        console.log(e)
      })

    tx.wait().then(async (res: any) => {
      if (!res.events) {
        return
      }

      const address: string = res.events[0]?.address

      if (!address || !listAddStakeholders || !listAddStakeholders.length) {
        return
      }

      const ERC20Instance = new ethers.Contract(
        process.env.REACT_APP_TOKEN_ADDRESS || '',
        ERC20,
        web3Provider.getSigner()
      )
      const tx2 = await ERC20Instance.approve(address, utils.parseEther(amount.toString())).catch((e: any) => {
        console.log(e)
      })

      const vestingInstance = new ethers.Contract(address || '', Vesting, web3Provider.getSigner())

      tx2.wait().then(async () => {
        await vestingInstance.addTokenGrants(addressList, amountList).catch((e: any) => {
          console.log(e)
        })
      })
    })
  }

  useEffect(() => {
    setIsDisable(!endDate || !startDate || !name || !(endDate.getTime() - startDate.getTime() > 0))
  }, [endDate, startDate, name])

  return (
    <DivNewPoolWrapper>
      <HeadingNewPool>Create New Pool</HeadingNewPool>
      <DivContent>
        <DivRow>
          <DivColumn>
            <TitleOptionNewPool title={'Pool Name'} />
            <OptionContent>
              <InputControl
                type="text"
                placeholder={'Input name for the pool'}
                onChange={(e) => handleGetName(e)}
                value={name}
              />
            </OptionContent>
          </DivColumn>
          <DivColumn>
            {(showInputFile && (
              <>
                <TitleOptionNewPool title={'Icon/Logo Upload'} />
                <DivUpload onDragEnter={onDragEnter} onDragOver={onDragOver} onDrop={handleDropFile}>
                  <InputFile type={'file'} id={'file_upload'} name={'file_upload'} onChange={handleChangeUploadImage} />
                  <LabelInputFile htmlFor={'file_upload'}>
                    <IconOxy SrcImageIcon={IconUploadFile} widthIcon={'15px'} heightIcon={'17px'} />
                    <span>Drag or choose file</span>
                  </LabelInputFile>
                </DivUpload>
              </>
            )) ||
              fileImage?.map((image: any, index: any) => {
                return (
                  <DivImageBox key={index} data-imgindex={index}>
                    <DivImage>
                      <img src={image.src} alt={image.name} />
                    </DivImage>
                    <DivImageIcon onClick={handleDeleteImage}>
                      <IconOxy SrcImageIcon={IconBin} widthIcon={'16px'} heightIcon={'16px'} />
                    </DivImageIcon>
                  </DivImageBox>
                )
              })}
          </DivColumn>
          <DivColumn>
            <TitleOptionNewPool title={'Initial Date (Lock Start)'} />
            <DivDatePicker>
              <LabelBox>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  minDate={new Date()}
                  placeholderText="Select prefer date"
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
                <DivIconCalendar>
                  <IconOxy SrcImageIcon={IconCalendar} heightIcon={'20px'} widthIcon={'20px'} />
                </DivIconCalendar>
              </LabelBox>
            </DivDatePicker>
          </DivColumn>
          <DivColumn>
            <TitleOptionNewPool />
            <DivDatePicker>
              <LabelBox>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  minDate={new Date()}
                  timeFormat="HH:mm"
                  placeholderText="Select prefer date"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
                <DivIconCalendar>
                  <IconOxy SrcImageIcon={IconCalendar} heightIcon={'20px'} widthIcon={'20px'} />
                </DivIconCalendar>
              </LabelBox>
            </DivDatePicker>
          </DivColumn>

          <DivColumn fullWidth={true}>
            <TitleOptionNewPool title={'Stakeholder(s)'} />
            {!listAddStakeholders.length ? (
              <DivAddStakeholders onClick={handleAddStakeholders}>
                <IconOxy SrcImageIcon={IconPlus} widthIcon={'16px'} heightIcon={'16px'} />
                <span>Add stakeholder(s)</span>
              </DivAddStakeholders>
            ) : (
              <ListStakeholder>
                {listAddStakeholders.map((item, index) => (
                  <ItemStakeholder key={index}>
                    <AddressStakeholder>{item.address}</AddressStakeholder>
                    <AmountStakeholder>{item.amount}</AmountStakeholder>
                  </ItemStakeholder>
                ))}
              </ListStakeholder>
            )}
          </DivColumn>
        </DivRow>
      </DivContent>
      <DivSubmit disabled={isDisable} onClick={handleCreatePool}>
        Create
      </DivSubmit>
    </DivNewPoolWrapper>
  )
}
const DivNewPoolWrapper = styled.div`
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px;
  border-radius: 16px;
  margin-top: 16px;
`
const HeadingNewPool = styled.h3`
  color: ${({ theme }) => theme.yellow1};
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.25;
`
const DivContent = styled.div`
  margin-top: 28px;
`
const DivRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;
`
const DivColumn = styled.div<{ fullWidth?: boolean }>`
  padding-left: 5px;
  padding-right: 5px;
  flex: 0 0 50%;
  max-width: 50%;
  margin-bottom: 40px;
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      flex: 0 0 100%;
      max-width: 100%;
    `}
`
const OptionContent = styled.div`
  margin-top: 20px;
`
const InputControl = styled.input`
  background-color: ${({ theme }) => theme.bg8};
  border-radius: 8px;
  padding: 8px 20px;
  outline: none;
  border: none;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
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
const DivDatePicker = styled.div`
  margin-top: 20px;
  .react-datepicker__input-container {
    input {
      width: 100%;
      background-color: ${({ theme }) => theme.bg8};
      border-radius: 8px;
      padding: 8px 40px 8px 20px;
      outline: none;
      border: none;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.25;
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
    }
  }
  .react-datepicker__month-container {
  }
  .react-datepicker__header {
    font-size: 16px;
    font-weight: 600;
  }
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .react-datepicker__day--selected {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.blue7};
  }
  .react-datepicker__day:hover {
    background-color: ${({ theme }) => theme.modalLay};
  }
  .react-datepicker__year-option:first-of-type .react-datepicker__navigation,
  .react-datepicker__year-option:last-of-type .react-datepicker__navigation {
    height: 20px;
  }
  .react-datepicker__triangle {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  .react-datepicker-popper {
    transform: none !important;
    inset: auto !important;
  }
`
const LabelBox = styled.label`
  position: relative;
`
const DivIconCalendar = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`
const DivUpload = styled.div`
  position: relative;
  margin-top: 20px;
  &:hover,
  &.dragover {
    opacity: 0.4;
    transition: opacity 0.25s ease-in;
  }
`
const InputFile = styled.input`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
`
const LabelInputFile = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.bg8};
  border-radius: 8px;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  & > span {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.25;
    margin-left: 8px;
    color: ${({ theme }) => theme.advancedBG};
  }
`
const DivImageBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`
const DivImage = styled.div`
  border: 1.5px solid ${({ theme }) => theme.bg8};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    display: block;
    width: 30px;
    height: 30px;
  }
`
const DivImageIcon = styled.div`
  margin-left: 12px;
  cursor: pointer;
`
const DivAddStakeholders = styled.div`
  margin-top: 20px;
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.advancedBG};
  background: ${({ theme }) => theme.bg8};
  border-radius: 8px;
  cursor: pointer;

  & > span {
    margin-left: 2px;
    margin-right: 2px;
  }
`

const DivSubmit = styled(BaseButton)`
  text-align: center;
  margin-top: 50px;
  margin-left: auto;
  width: 180px;
  padding: 8px 50px;
  color: ${({ theme }) => theme.blue6};
  background: ${({ theme }) => theme.yellow1};

  &:disabled {
    color: ${({ theme }) => theme.text12};
    background: ${({ theme }) => theme.bgButton};
  }
  align-items: baseline;
`

const ListStakeholder = styled.div``
const ItemStakeholder = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.white};
  padding: 20px 0;
  border-bottom: ${({ theme }) => `1px dashed ${theme.blue7}`};
`
const AddressStakeholder = styled.div``
const AmountStakeholder = styled.div`
  margin-left: auto;
`

export default CreateNewPool
