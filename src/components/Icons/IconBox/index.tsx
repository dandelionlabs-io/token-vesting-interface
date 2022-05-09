import React from 'react'
import styled from 'styled-components/macro'

interface Props {
  width?: string
  height?: string
  color?: string
  square?: boolean
  children?: any
  onClick?: () => void
}
const SpanIconBox = styled.span<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => (props.square ? '12px' : '50%')};
  background-color: ${(props) => (props.color === 'green' ? '#00ff45' : '#f9f9f9')};
  width: ${(props) => props.width || '36px'};
  height: ${(props) => props.height || '36px'};
  cursor: pointer;
`
const IconBox = (props: Props) => {
  const { width, height, color, square, onClick, children } = props
  return (
    <SpanIconBox width={width} height={height} color={color} square={square} onClick={onClick}>
      {children}
    </SpanIconBox>
  )
}

export default IconBox
