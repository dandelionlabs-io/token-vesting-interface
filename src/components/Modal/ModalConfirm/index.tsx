import React from 'react'
import styled from 'styled-components/macro'

import Modal from '../index'

interface Props {
  isOpen: boolean
  onDimiss: () => void
  isOpenPopupSuccess?: () => void
  content: {
    header: string
    notification: string
  }
}
const ModalConfirm = (props: Props) => {
  const { isOpen, onDimiss, isOpenPopupSuccess, content } = props

  return (
    <>
      <Modal isOpen={isOpen} onDismiss={onDimiss} maxWidth={'516px'}>
        <ModalContent>
          <ModalHeader>{content.header}</ModalHeader>
          <ModalBody>
            <Notification>{content.notification}</Notification>
            <DivGroupButton>
              <DivButtonItem>
                <ButtonNo onClick={onDimiss}>No</ButtonNo>
              </DivButtonItem>
              <DivButtonItem>
                <ButtonYes onClick={isOpenPopupSuccess}>Yes</ButtonYes>
              </DivButtonItem>
            </DivGroupButton>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const ModalContent = styled.div`
  padding: 0;
  width: 100%;
`
const ModalHeader = styled.h3`
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 49px;
`
const ModalBody = styled.div`
  margin-top: 24px;
`
const Notification = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  margin: 32px 0 40px;
`
const DivGroupButton = styled.div`
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
`
const DivButtonItem = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 8px;
  padding-right: 8px;
`
const Button = styled.button`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  border: none;
  outline: none;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  padding: 8px;
  cursor: pointer;
`
const ButtonNo = styled(Button)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.bgPrimary};
`
const ButtonYes = styled(Button)`
  color: ${({ theme }) => theme.blue5};
  background-color: ${({ theme }) => theme.yellow1};
`
// const BlockIcon = styled.div`
//   display: flex;
//   justify-content: center;
// `
// const NotificationSuccess = styled.p`
//   margin-bottom: 0;
//   margin-top: 24px;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 1.25;
//   text-align: center;
//   color: ${({ theme }) => theme.white};
// `
export default ModalConfirm
