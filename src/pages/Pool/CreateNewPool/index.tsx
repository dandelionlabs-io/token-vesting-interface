import 'react-datepicker/dist/react-datepicker.css'

import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import styled, { css } from 'styled-components/macro'

import IconBin from '../../../assets/svg/icon/icon-dandelion-bin.svg'
import IconCalendar from '../../../assets/svg/icon/icon-dandelion-calender.svg'
import IconUploadFile from '../../../assets/svg/icon/icon-dandelion-upload-file.svg'
import IconOxy from '../../../components/Icons/IconOxy'
import TitleOptionNewPool from '../TitleOptionNewPool'

interface fileImage {
  name: string
  type: string
  size: number
  src: any
}
const CreateNewPool = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const handleStartDateChange = (date: any) => setStartDate(date)
  const handleEndDateChange = (date: any) => setEndDate(date)
  const [fileImage, setFileImage] = useState<fileImage[]>([])
  const [showInpuFile, setShowInputFile] = useState<boolean>(true)
  const onDragEnter = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const onDragOver = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
  }

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

  return (
    <DivNewPoolWrapper>
      <HeadingNewPool>Create New Pool</HeadingNewPool>
      <DivContent>
        <DivRow>
          <DivColumn>
            <TitleOptionNewPool title={'Pool Name'} />
            <OptionContent>
              <InputControl type="text" placeholder={'Input name for the pool'} />
            </OptionContent>
          </DivColumn>
          <DivColumn>
            <TitleOptionNewPool title={'Icon/Logo Upload'} />

            {(showInpuFile && (
              <DivUpload onDragEnter={onDragEnter} onDragOver={onDragOver} onDrop={handleDropFile}>
                <InputFile type={'file'} id={'file_upload'} name={'file_upload'} onChange={handleChangeUploadImage} />
                <LabelInputFile htmlFor={'file_upload'}>
                  <IconOxy SrcImageIcon={IconUploadFile} widthIcon={'15px'} heightIcon={'17px'} />
                  <span>Drag or choose file</span>
                </LabelInputFile>
              </DivUpload>
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
                  showYearDropdown
                  dateFormatCalendar="MMMM"
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                  placeholderText="Select prefer date"
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
                  showYearDropdown
                  dateFormatCalendar="MMMM"
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                  placeholderText="Select prefer date"
                />
                <DivIconCalendar>
                  <IconOxy SrcImageIcon={IconCalendar} heightIcon={'20px'} widthIcon={'20px'} />
                </DivIconCalendar>
              </LabelBox>
            </DivDatePicker>
          </DivColumn>
          <DivColumn fullWidth={true}>
            <TitleOptionNewPool title={'Stakeholder(s)'} />
          </DivColumn>
        </DivRow>
      </DivContent>
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
export default CreateNewPool
