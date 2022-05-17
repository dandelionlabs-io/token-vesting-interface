import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, providers } from 'ethers'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import Vesting from '../../abis/Vesting'
import Api from '../../api'
import { ReactComponent as Logo } from '../../assets/svg/dandelionlabs_logo_dashboard.svg'
import AddStake from '../../assets/svg/icon/icon-dandelion-add-circle.svg'
import IconCDRED from '../../assets/svg/icon/icon-dandelion-cdred.svg'
import IconETH from '../../assets/svg/icon/icon-dandelion-eth.svg'
import User from '../../assets/svg/icon/icon-user-profile.svg'
import BlockChart from '../../components/BlockChart'
import BlockFeatureUser from '../../components/BlockFeatureUser'
import GoBack from '../../components/GoBack'
import ModalSuccess from '../../components/Modal/ModalSuccess'
import SidebarMenu from '../../components/SidebarMenu'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalances } from '../../hooks/useCurrencyBalance'
import { AppState } from '../../state'
import { useCloseModal, useModalOpen, useSuccessModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { useAppSelector } from '../../state/hooks'
import { useCDREDBalance } from '../../state/pools/hook'
import { ethBalance, shortenAddress } from '../../utils'
import BlockUpdateAddress from './BlockUpdateAddress'
import StakeHolder from './StakeHolders'
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
  const closeModal = useCloseModal()

  const successModalOpen = useModalOpen(ApplicationModal.POPUP_SUCCESS)
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
  const [addStakeholder, setAddStakeholder] = useState<boolean>(false)

  useEffect(() => {
    !address && history.push({ pathname: `dashboard` })
  }, [history, address])

  useEffect(() => {
    if (!poolsData.data?.length) {
      return
    }
    const obj = poolsData.data.find((o: any) => o.address === address)
    console.log(obj)

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
        const dataHis: any = await Api.get(url)

        const dataHisClone: Array<any> = [...dataHis]

        for (let i = dataHisClone.length - 1; i > -1; i--) {
          dataHisClone[i].remain = data.amount - ethBalance(dataHisClone[i].amountClaimed)
        }

        setHistoryClam(dataHisClone)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [url, data])

  const handleAddStake = () => {
    setAddStakeholder(true)
  }

  const handleClaim = async () => {
    const provider: any = await detectEthereumProvider()
    const web3Provider = new providers.Web3Provider(provider)

    const vestingInstance = new ethers.Contract(address || '', Vesting, web3Provider.getSigner())

    const tx = await vestingInstance
      .claimVestedTokens(account)
      .then(() => {
        toggleSuccessModal()
      })
      .catch((e: any) => {
        console.log(e)
      })
      .finally(() => {
        setTimeout(function () {
          closeModal()
        }, 3000)
      })

    tx?.wait().then(() => window.location.reload())
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
    amount: userCDREDBalance.toFixed(3),
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

        {!transferOwner && !addStakeholder && (
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
                    <HeadSpan fontsize="16px">{data.remain && data.remain.toFixed(3)}</HeadSpan> <HeadSpan></HeadSpan>
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
                    <ClaimButton onClick={handleClaim}>Claim</ClaimButton>
                  </ProgressBarContent>
                </ProgressDiv>
                {data.roles?.includes('ADMIN') ||
                  (data.roles?.includes('MANAGER') && (
                    <div onClick={() => setTransferOwner(true)}>
                      <BlockFeatureUser dataImage={IconUser} name={'Transfer Owner'} />
                    </div>
                  ))}
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
                      <HeadSpan fontsize="16px">
                        {moment(item.timestamp * 1000).format('MMM DD YYYY hh:mm:ss')}
                      </HeadSpan>
                      <HeadSpan fontsize="16px">{(parseInt(item.amountClaimed) / 1e18).toFixed(4)}</HeadSpan>
                      <HeadSpan>{parseFloat(item.remain).toFixed(4)}</HeadSpan>
                    </ListContainer>
                  ))}
                <div>
                  {data.roles?.includes('ADMIN') ||
                    (data.roles?.includes('MANAGER') && (
                      <div onClick={handleAddStake}>
                        <BlockFeatureUser dataImage={IconAddStake} name={'Add Stakeholder(s)'} />
                      </div>
                    ))}
                </div>
              </EmptyContainer>
            </BlockWrapper>
            <ModalSuccess isOpen={successModalOpen} onDimiss={toggleSuccessModal}></ModalSuccess>
          </>
        )}

        {transferOwner && (
          <>
            <GoBack setTransferOwner={setTransferOwner} data={'Go back to DandelionLabs'} />
            <BlockUpdateAddress addressWallet={'Ukwx9Vs4C1d9d1fF46g7F'} />
          </>
        )}
        {addStakeholder && (
          <>
            <GoBack setTransferOwner={setAddStakeholder} data={'Go back to DandelionLabs'} />
            <StakeHolder />
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
