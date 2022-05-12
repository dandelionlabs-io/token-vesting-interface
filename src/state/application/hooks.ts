import { useCallback, useMemo } from 'react'

import { useAppDispatch, useAppSelector } from '../hooks'
import { AppState } from '../index'
import { ApplicationModal, removePopup, setOpenModal } from './reducer'

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useAppSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useTogglePrivacyPolicy(): () => void {
  return useToggleModal(ApplicationModal.PRIVACY_POLICY)
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useAppSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter((item) => item.show), [list])
}

export function useSuccessModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POPUP_SUCCESS)
}
export function useConfirmModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POPUP_CONFIRM)
}
