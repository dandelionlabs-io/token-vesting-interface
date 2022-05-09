import { Box } from 'rebass/styled-components'
import styled from 'styled-components/macro'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  color?: string
  $borderRadius?: string
  backgroundColor?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border: ${({ border }) => border};
  background-color: ${({ backgroundColor }) => backgroundColor};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme, backgroundColor }) => (backgroundColor ? backgroundColor : theme?.bg2)};
  background-color: ${({ theme, backgroundColor }) => (backgroundColor ? backgroundColor : theme?.bg1)};
`

export const DarkGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg2};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg3};
`
