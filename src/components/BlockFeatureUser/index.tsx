import React from 'react'
import styled from 'styled-components/macro'

import IconOxy from '../Icons/IconOxy'
interface Props {
  name?: string
  dataImage?: {
    SrcImageIcon: string
    widthIcon: string
    heightIcon: string
  }
}
const BlockFeatureUser = (props: Props) => {
  const { name, dataImage } = props

  return (
    <Box>
      <IconOxy
        SrcImageIcon={dataImage?.SrcImageIcon}
        widthIcon={dataImage?.widthIcon}
        heightIcon={dataImage?.heightIcon}
      />

      <NameFeature>{name}</NameFeature>
    </Box>
  )
}
const Box = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const NameFeature = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.yellow3};
  margin-left: 8px;
  margin-bottom: 0;
`

export default BlockFeatureUser
