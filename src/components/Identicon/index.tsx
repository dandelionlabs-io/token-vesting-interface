import jazzicon from '@metamask/jazzicon'
import { useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.bg4};
  font-size: initial;
`

export default function Identicon() {
  const { account } = useActiveWeb3React()

  const icon = useMemo(() => account && jazzicon(16, parseInt(account.slice(2, 10), 16)), [account])
  const iconRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
      return () => {
        try {
          current?.removeChild(icon)
        } catch (e) {
          console.error('Avatar icon not found')
        }
      }
    }
    return
  }, [icon, iconRef])

  return (
    <StyledIdenticon>
      <span ref={iconRef} />
    </StyledIdenticon>
  )
}
