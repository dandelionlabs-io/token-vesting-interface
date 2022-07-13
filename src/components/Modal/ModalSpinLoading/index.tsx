import React from 'react'
import styled from 'styled-components/macro'

import Modal from '../index'
interface Props {
  isOpen: boolean
  onDimiss: () => void
}

const ModalSpinLoading = (props: Props) => {
  const { isOpen, onDimiss } = props
  return (
    <Modal isOpen={isOpen} maxWidth={'150px'} onDismiss={onDimiss}>
      <ModalContent>
        <ModalBody>
          <LoadingSpinner></LoadingSpinner>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const ModalContent = styled.div`
  padding: 0;
  width: 50%;
`

const ModalBody = styled.div``
const LoadingSpinner = styled.div`
  margin-left: 12px;
  pointer-events: none;
  width: 60px;
  height: 60px;
  border: 0.4em solid ${({ theme }) => theme.spin1};
  border-top-color: ${({ theme }) => theme.spin2};
  border-radius: 50%;
  animation: loadingspin 1.5s linear infinite;
`
export default ModalSpinLoading
