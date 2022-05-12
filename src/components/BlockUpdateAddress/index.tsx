import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { useConfirmModalToggle, useModalOpen, useSuccessModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import ModalConfirm from '../Modal/ModalConfirm'
import ModalSuccess from '../Modal/ModalSuccess'

interface Props {
  addressWallet?: string
}
const BlockUpdateAddress = (props: Props) => {
  const { addressWallet } = props
  const [valueAddress, setValueAddress] = useState<string>()
  const handleChange = (e: any) => {
    setValueAddress(e.target.value)
  }
  const toggleConfirmModal = useConfirmModalToggle()
  const confirmModalOpen = useModalOpen(ApplicationModal.POPUP_CONFIRM)
  const toggleSuccessModal = useSuccessModalToggle()
  const succesModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
  return (
    <>
      <BlockWrapper>
        <Heading3>Change Stakeholder</Heading3>
        <DivFlex>
          <DivFlexItem>
            <div>
              <Label>Old Address</Label>
              <FormControlBox>
                <FormControl type="text" value={addressWallet} readOnly={true} />
              </FormControlBox>
            </div>
          </DivFlexItem>
          <DivFlexItem>
            <div>
              <Label>New Address</Label>
              <FormControlBox>
                <FormControl type="text" placeholder={'Input new address'} onChange={(e) => handleChange(e)} />
              </FormControlBox>
            </div>
          </DivFlexItem>
        </DivFlex>
        <DivBoxBtn>
          <BtnChange disabled={!valueAddress} type={'button'} onClick={toggleConfirmModal}>
            Change
          </BtnChange>
        </DivBoxBtn>
      </BlockWrapper>
      <ModalConfirm isOpen={confirmModalOpen} onDimiss={toggleConfirmModal} isOpenPopupSuccess={toggleSuccessModal} />
      <ModalSuccess isOpen={succesModalOpen} onDimiss={toggleSuccessModal}></ModalSuccess>
    </>
  )
}
const BlockWrapper = styled.div`
  padding: 24px 32px;
  background: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  border-radius: 16px;
`
const Heading3 = styled.h3`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: ${({ theme }) => theme.yellow1};
  margin-bottom: 28px;
`
const BtnChange = styled.button`
  border-radius: 8px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;

  outline: none;
  border: none;
  width: 180px;
  padding: 8px;
  margin-left: auto;
  background-color: ${({ theme }) => theme.yellow1};
  color: ${({ theme }) => theme.blue6};
  &[disabled] {
    background-color: ${({ theme }) => theme.bgButton};
    color: ${({ theme }) => theme.text12};
  }
`
const DivFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const DivFlexItem = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
`
const Label = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  color: ${({ theme }) => theme.white};
  padding-left: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.blue5};
`
const FormControlBox = styled.div`
  margin: 28px 8px 0;
`
const FormControl = styled.input`
  padding: 8px 20px;
  background-color: ${({ theme }) => theme.bgPrimary};
  outline: none;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  width: 100%;
  color: ${({ theme }) => theme.white};
  &[readonly] {
    color: ${({ theme }) => theme.textGray};
  }
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
const DivBoxBtn = styled.div`
  display: flex;
  margin-top: 22px;
`
/*const NotificationSuccess = styled.p`
  margin-bottom: 0;
  margin-top: 24px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  text-align: center;
  color: ${({ theme }) => theme.white};
`*/
export default BlockUpdateAddress
