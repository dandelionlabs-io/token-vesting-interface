import React from 'react'
import styled from 'styled-components/macro'

interface Props {
  widthIcon?: string
  heightIcon?: string
  SrcImageIcon?: string
}
const SpanIconOxy = styled.span<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.widthIcon || '36px'};
  height: ${(props) => props.heightIcon || '36px'};
`
const ImageIcon = styled.img`
  display: block;
  width: 100%;
  vertical-align: middle;
`
const IconOxy = (props: Props) => {
  const { SrcImageIcon, widthIcon, heightIcon } = props
  return (
    <SpanIconOxy widthIcon={widthIcon} heightIcon={heightIcon}>
      <ImageIcon src={SrcImageIcon} alt={'Image_icon'} />
    </SpanIconOxy>
  )
}

export default IconOxy
