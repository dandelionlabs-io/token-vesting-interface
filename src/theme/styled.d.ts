import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components/macro'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  text7: Color
  text8: Color
  textGray: Color
  text10: Color
  text11: Color
  text12: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  bgPrimary: Color
  bgPrimaryLight: Color
  bgButton: Color
  modalBG: Color
  advancedBG: Color
  modalLay: Color
  borderCard: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color
  textHighLight: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  blue1: Color
  blue2: Color

  blue4: Color
  blue5: Color
  blue6: Color
  blue7: Color

  error: Color
  success: Color
  warning: Color

  spin1: Color
  spin2: Color
}

declare module 'styled-components/macro' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string
    boxShadow: string
    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
