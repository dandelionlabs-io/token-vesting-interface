import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import Api from '../../api'
import { ReactComponent as Logo } from '../../assets/svg/dandelionlabs_logo_dashboard.svg'
import AddStake from '../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import User from '../../assets/svg/icon/icon-user-profile.svg'
import BlockChart from '../../components/BlockChart'
import BlockFeatureUser from '../../components/BlockFeatureUser'
import BlockUpdateAddress from '../../components/BlockUpdateAddress'
import GoBack from '../../components/GoBack'
import ModalSuccess, { DataModalSuccess } from '../../components/Modal/ModalSuccess'
import SidebarMenu from '../../components/SidebarMenu'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { AppState } from '../../state'
import { useModalOpen, useSuccessModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { useAppSelector } from '../../state/hooks'
import { useCDREDBalance } from '../../state/pools/hook'
import { shortenAddress } from '../../utils'
import { ethBalance } from '../../utils'
interface TypeItemInfo {
  dataChart?: any
  heading?: string
  amount?: number | string
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}

const DandelionIcon = styled.div`
  transition: transform 0.3s ease;
  margin: 20px 0;

  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > svg{
        width: 128px !important;
    }
  `};
`
const IconUser = {
  SrcImageIcon: User,
  widthIcon: '16px',
  heightIcon: '15px',
}

const IconAddStake = {
  SrcImageIcon: AddStake,
  widthIcon: '16px',
  heightIcon: '15px',
}

const Pool = () => {
  const { account } = useActiveWeb3React()
  const toggleSuccessModal = useSuccessModalToggle()
  const succesModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
  const poolsData = useAppSelector((state: AppState) => state.pools)
  const history = useHistory()
  const address = window.localStorage.getItem('address')
  const [data, setData] = useState<any>({})
  const url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_NETWORK}/${address}/claims/${account}`
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const [historyClaim, setHistoryClam] = useState<any>([])
  const [claimedPercent, setClaimedPercent] = useState<number>(0)
  const [claimablePercent, setClaimablePercent] = useState<number>(0)

  const userCDREDBalance = useCDREDBalance()
  const [transferOwner, setTransferOwner] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(59.6479)
  const dataModalSuccess: DataModalSuccess = {
    type: 'claim',
    amount,
  }
  useEffect(() => {
    !address && history.push({ pathname: `dashboard` })
  }, [history, address])

  useEffect(() => {
    if (!poolsData.data?.length) {
      return
    }
    const obj = poolsData.data.find((o: any) => o.address === address)
    setData(obj)
    if (obj.amount <= 0) {
      setClaimedPercent(0)
      setClaimablePercent(0)
    } else {
      setClaimedPercent((obj.claimed / obj.amount) * 100)
      setClaimablePercent((obj.claimable / obj.amount) * 100)
    }
  }, [address, poolsData?.data])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await Api.get(url)
        setHistoryClam(data)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [url])

  const handleAddStake = () => {
    history.push({ pathname: `stake` })
  }

  const dataETH: TypeItemInfo = {
    heading: 'ETH Balance',
    amount: userEthBalance?.toSignificant(4),
    widthIcon: '28px',
    heightIcon: '39px',
    SrcImageIcon: IconETH,
  }
  const dataCDRED: TypeItemInfo = {
    heading: 'CDRED Balance',
    amount: userCDREDBalance,
    widthIcon: '39px',
    heightIcon: '29px',
    SrcImageIcon: IconCDRED,
  }
  return (
    <>
      <SidebarMenu />
      <div>
        <BlockChartList>
          <BlockChartItem>
            <BlockChart itemInfo={dataETH} />
          </BlockChartItem>
          <BlockChartItem>
            <BlockChart itemInfo={dataCDRED} />
          </BlockChartItem>
        </BlockChartList>

        {(!transferOwner && (
          <>
            <DandelionIcon>
              <Logo width="200px" height="100%" title="logo" />
            </DandelionIcon>
            <BlockWrapper>
              <EmptyContainer>
                <Heading>Detail</Heading>

                <ListContainer>
                  <HeadSpan fontsize="16px" fontweight="bold">
                    Contract Address
                  </HeadSpan>
                  <HeadSpan>
                    <HeadSpan fontsize="16px">{shortenAddress(address || '')}</HeadSpan> <HeadSpan></HeadSpan>
                  </HeadSpan>
                </ListContainer>
                <ListContainer>
                  <HeadSpan fontsize="16px" fontweight="bold">
                    Lock Start Time
                  </HeadSpan>
                  <HeadSpan>
                    <HeadSpan fontsize="16px">{moment(data.start).format('MMM DD, YYYY')}</HeadSpan>
                  </HeadSpan>
                </ListContainer>
                <ListContainer>
                  <HeadSpan fontsize="16px" fontweight="bold">
                    Lock End Time
                  </HeadSpan>
                  <HeadSpan>
                    <HeadSpan fontsize="16px">{moment(data.end).format('MMM DD, YYYY')}</HeadSpan>
                  </HeadSpan>
                </ListContainer>
                <ListContainer>
                  <HeadSpan fontsize="16px" fontweight="bold">
                    Total Locked Amount
                  </HeadSpan>
                  <HeadSpan>
                    <HeadSpan fontsize="16px">{data.remain}</HeadSpan> <HeadSpan></HeadSpan>
                  </HeadSpan>
                </ListContainer>
                <ProgressDiv>
                  <HeadSpan fontsize="16px" fontweight="bold" color="white">
                    Progress detail
                  </HeadSpan>
                  <ProgressBar>
                    <ProgressInner width={`${claimedPercent}`} background="#FAA80A"></ProgressInner>
                    <ProgressInner width={`${claimablePercent}`} background="#18aa00"></ProgressInner>
                  </ProgressBar>
                  <ProgressBarContent>
                    <HeadSpan fontsize="14px" fontweight="400" color="#FAA80A" style={{ margin: '0' }}>
                      Claimed <SpanIcon background="#FAA80A"></SpanIcon>
                    </HeadSpan>
                    <HeadSpan fontsize="14px" fontweight="400" color="#18AA00" style={{ margin: '0' }}>
                      Claimable <SpanIcon background="#18AA00"></SpanIcon>
                    </HeadSpan>
                    <HeadSpan fontsize="14px" fontweight="400" color="#868B90 " style={{ margin: '0' }}>
                      Remaining balance <SpanIcon background="#868B90"></SpanIcon>
                    </HeadSpan>
                    <ClaimButton onClick={toggleSuccessModal}>Claim</ClaimButton>
                  </ProgressBarContent>
                </ProgressDiv>
                <div onClick={() => setTransferOwner(true)}>
                  <BlockFeatureUser dataImage={IconUser} name={'Transfer Owner'} />
                </div>
              </EmptyContainer>
              <EmptyContainer>
                <Heading>History of Claims</Heading>

                <ListContainer>
                  <HeadSpan fontsize="16px" fontweight="bold">
                    Date
                  </HeadSpan>
                  <HeadSpan fontsize="16px">Claimed Amt.</HeadSpan>
                  <HeadSpan>Remaining</HeadSpan>
                </ListContainer>

                {historyClaim &&
                  !!historyClaim.length &&
                  historyClaim.map((item: any, i: number) => (
                    <ListContainer key={i}>
                      <HeadSpan fontsize="16px">{moment(item.timestamp).format('MMM DD, YYYY')}</HeadSpan>
                      <HeadSpan fontsize="16px">{ethBalance(item.amountClaimed)}</HeadSpan>
                      <HeadSpan>Remaining</HeadSpan>
                    </ListContainer>
                  ))}
                <div onClick={handleAddStake}>
                  <BlockFeatureUser dataImage={IconAddStake} name={'Add Stakeholder(s)'} />
                </div>
              </EmptyContainer>
            </BlockWrapper>
            <ModalSuccess isOpen={succesModalOpen} onDimiss={toggleSuccessModal} data={dataModalSuccess}></ModalSuccess>
          </>
        )) || (
          <>
            <GoBack setTransferOwner={setTransferOwner} data={'Go back to DandelionLabs'} />
            <BlockUpdateAddress addressWallet={'Ukwx9Vs4C1d9d1fF46g7F'} />
          </>
        )}
      </div>
    </>
  )
}
const ClaimButton = styled.button`
  color: ${({ theme }) => theme.white};
  background: #18aa00;
  margin-top: 30px;
  padding: 8px 0;
  width: 180px;
  height: 36px;
  border-radius: 8px;
  border: transparent;
  cursor: pointer;
`
const ProgressBarContent = styled.div`
  padding: 5px;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`
const ProgressDiv = styled.div`
  padding: 5px;
`
const ProgressInner = styled.div<{ width?: string; background?: string }>`
  background: ${(props) => props.background};
  height: 100%;
  // border-radius: 12px 0px 0px 12px;
  display: inline-block;

  width: ${(props) => props.width}%;
`
const ProgressBar = styled.div`
  display: flex;
  background: #868b90;
  height: 20px;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  margin: 10px 0;
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
const ListContainer = styled.div`
  padding: 10px;
  border-bottom: 1px solid #00316f;
  color: white;
  display: flex;
  justify-content: space-between;
`

const EmptyContainer = styled.div`
  border-radius: 16px;
  background-image: linear-gradient(180deg, #000d1e 31.72%, #002859 100%);
  padding: 24px 32px 20px;
  display: flex;
  flex-direction: column;
  min-height: 460px;
  box-sizing: border-box;
  width: 45%;
  min-width: 400px;

  & > div:last-child {
    margin-top: auto;
  }
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
export default Pool
