import React from 'react'
import styled from 'styled-components/macro'

import IconCdred from '../../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconSuccess from '../../../assets/svg/icon/icon-success.svg'
import IconOxy from '../../Icons/IconOxy'
import Modal from '../index'
interface Props {
  isOpen: boolean
  onDimiss: () => void
  data?: DataModalSuccess
}
export interface DataModalSuccess {
  type: string
  amount?: string | number
}
const ModalSuccess = (props: Props) => {
  const { isOpen, onDimiss, data } = props
  return (
    <Modal isOpen={isOpen} onDismiss={onDimiss}>
      <ModalContent>
        <ModalHeader>Success</ModalHeader>
        <ModalBody>
          <BlockIcon>
            <IconOxy SrcImageIcon={IconSuccess} widthIcon={'80px'} heightIcon={'80px'} />
          </BlockIcon>
          {data?.type === 'claim' && (
            <InfoClaimed>
              You have claimed <SpanAmount> {data.amount ? data.amount : 0} </SpanAmount>
              <IconOxy SrcImageIcon={IconCdred} widthIcon={'19px'} heightIcon={'14px'} /> tokens
            </InfoClaimed>
          )}
          {data?.type === 'stakeholder' && <NotificationSuccess>New address has been updated</NotificationSuccess>}
          {data?.type === 'ownership' && <NotificationSuccess>New owner has been assigned</NotificationSuccess>}
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
export default ModalSuccess
