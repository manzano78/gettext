import { ReactHTML, ReactNode } from 'react'

export interface TranslatorProviderProps {
  locale: string
  sourceLocale?: string
  isDebugEnabled?: boolean
  translations?: object
  children?: ReactNode | ((translatorContext: TranslatorContext) => ReactNode)
}

export interface TranslatorContext {
  locale: string
  gettext: (
    msgid: string,
    ...args: Array<{ [k: string]: any } | string>
  ) => string
  pgettext: (
    msgctxt: string,
    msgid: string,
    ...args: Array<{ [k: string]: any } | string>
  ) => string
  ngettext: (
    msgid: string,
    msgidPlural: string,
    count: number,
    ...args: Array<{ [k: string]: any } | string>
  ) => string
  npgettext: (
    msgctxt: string,
    msgid: string,
    msgidPlural: string,
    count: number,
    ...args: Array<{ [k: string]: any } | string>
  ) => string
}

export interface TranslateProps extends TranslateOptions {
  comments?: string[]
}

export type HTMLTranslateProps<
  T extends keyof JSX.IntrinsicElements
> = TranslateProps &
  JSX.IntrinsicElements[T] & {
    renderAs?: T
  }

export interface TranslateOptions {
  msgid: string
  msgctxt?: string
  msgidPlural?: string
  count?: number
  params?: Array<{ [k: string]: any } | string> | { [k: string]: any } | string
}
