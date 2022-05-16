import React from 'react'
import styled from 'styled-components/macro'

import Modal from '../index'
interface Props {
  isOpen: boolean
  onDimiss: () => void
  data?: DataModalLoading
}
export interface DataModalLoading {
  type: string
  amount?: string | number
}
const ModalLoading = (props: Props) => {
  const { isOpen, onDimiss, data } = props
  return (
    <Modal isOpen={isOpen} onDismiss={onDimiss}>
      <ModalContent>
        <ModalHeader>Loading</ModalHeader>
        <ModalBody>
          <BlockIcon>{/* <IconOxy SrcImageIcon={IconSuccess} widthIcon={'80px'} heightIcon={'80px'} /> */}</BlockIcon>

          {data?.type === 'loading' && <NotificationSuccess>Approving...</NotificationSuccess>}
        </ModalBody>
      </ModalContent>
    </Modal>
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
const BlockIcon = styled.div`
  display: flex;
  justify-content: center;
`
const InfoClaimed = styled.pre`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: ${({ theme }) => theme.white};
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`
const SpanAmount = styled.span`
  color: ${({ theme }) => theme.yellow1};
  font-weight: 600;
`
const NotificationSuccess = styled.p`
  margin-bottom: 0;
  margin-top: 24px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: ${({ theme }) => theme.white};
`
export default ModalLoading
