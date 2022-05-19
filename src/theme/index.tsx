import React from 'react'
import { Text, TextProps as TextPropsOriginal } from 'rebass'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components/macro'

import { Colors } from './styled'

export * from './components'

type TextProps = Omit<TextPropsOriginal, 'css'>

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

function colors(): Colors {
  return {
    // base
    white,
    black,
    // text
    text1: '#000000',
    text2: '#565A69',
    text3: '#6E727D',
    text4: '#f9f9f9',
    text5: '#EDEEF2',
    text6: '#01FF45',
    text7: 'rgba(255, 255, 255, 0.56)',
    text8: '#afafaf',
    textGray: '#878787',
    text10: '#DADADA',
    text11: '#868B90',
    text12: 'rgba(109, 149, 199, 0.3)',
    // backgrounds / greys
    bg0: '#ffffff',
    bg1: '#f2f8ff',
    bg2: '#d6e0ec',
    bg3: '#f6f6f6',
    bg4: '#888D9B',
    bg5: '#00142D',
    bg6: '#01FF45',
    bg7: '#efefef',
    bg8: 'rgba(255, 255, 255, 0.1)',
    bgPrimary: '#010E1E',
    bgPrimaryLight: '#01152D',
    bgButton: 'rgba(0, 9, 19, 0.3)',
    //specialty colors
    modalBG: 'rgba(246, 246, 246, 0.1)',
    modalLay: 'rgba(0,20,45,0.5)',
    advancedBG: 'rgba(255,255,255,0.6)',
    borderCard: '#F5841F',
    //primary colors
    primary1: '#CC3366',
    primary2: '#f6b664',
    primary3: '#facc92',
    primary4: '#fceddd',
    primary5: '#fcf1e9',
    // color text
    primaryText1: '#FFAB40',
    textHighLight: '#00ff45',
    // secondary colors
    secondary1: '#FFBF77',
    secondary2: '#F6DDE8',
    secondary3: '#FDEAF1',
    // other
    red1: '#DA2D2B',
    red2: '#DF1F38',
    red3: '#CC3366',
    green1: '#007D35',
    yellow1: '#FAA80A',
    yellow2: '#FF8F00',
    yellow3: '#9E6700',
    blue1: '#0068FC',
    blue2: '#0068FC',
    error: '#DF1F38',
    success: '#007D35',
    warning: '#FF8F00',
    // dont wanna forget these blue yet
    blue4: '#153d6f70',
    blue5: '#00316E',
    blue6: '#012553',
    blue7: '#00316F',
    // blue5: '#153d6f70' : '#EBF4FF',
  }
}

function theme(): DefaultTheme {
  return {
    ...colors(),
    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },
    //shadows
    shadow1: '#2F80ED',
    boxShadow: 'inset 0 3px 5px 1.73333px rgba(0, 0, 0, 0.26)',
    // media queries
    mediaWidth: mediaWidthTemplates,
    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode | null }) {
  const themeObject = theme()

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

/**
 * Preset styles of the Rebass Text component
 */
export const ThemedText = {
  Main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  Link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  Label(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },
  Black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  White(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  Body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  LargeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  SubHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  Small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  Blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  Yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />
  },
  DarkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  Gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  Italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  Error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}

export const ThemedGlobalStyle = createGlobalStyle`

html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1} !important;

  & > body{
    margin: 0 !important;
    padding: 0 !important;
  }
}

a {
 color: ${({ theme }) => theme.blue1}; 
}
*,
*::after,
*::before {
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
`
