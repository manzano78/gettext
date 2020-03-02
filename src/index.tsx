import React, {
  createContext,
  createElement,
  useContext,
  useMemo,
  useRef
} from 'react'
import format from 'string-format'
import GetText from 'node-gettext'
import shallowEqual from 'shallowequal'
import sanitize from 'sanitize-html'
import {
  HTMLTranslateProps,
  TranslateOptions,
  TranslateProps,
  TranslatorContext,
  TranslatorProviderProps
} from './types'

const DEFAULT_HTML_CONTAINER_TYPE = 'span'

const TranslatorContext = createContext<TranslatorContext>(null as any)

export function TranslatorProvider(props: TranslatorProviderProps) {
  const { children, isDebugEnabled, locale, sourceLocale, translations } = props

  const translatorContext = useMemo(
    () =>
      createTranslatorContext(
        locale,
        sourceLocale,
        isDebugEnabled,
        translations
      ),
    [locale, sourceLocale, isDebugEnabled, translations]
  )

  const finalChildren = useMemo(
    () =>
      typeof children === 'function' ? children(translatorContext) : children,
    [children, translatorContext]
  )

  return (
    <TranslatorContext.Provider value={translatorContext}>
      {finalChildren}
    </TranslatorContext.Provider>
  )
}

export function Translate(props: TranslateProps) {
  const { count, msgctxt, msgid, msgidPlural, params } = props
  const translation = useTranslation({
    count,
    msgctxt,
    msgid,
    msgidPlural,
    params
  })

  return <>{translation}</>
}

export function HTMLTranslate<T extends keyof JSX.IntrinsicElements>(
  props: HTMLTranslateProps<T>
) {
  const {
    count,
    msgctxt,
    msgid,
    msgidPlural,
    params,
    comments,
    renderAs = DEFAULT_HTML_CONTAINER_TYPE,
    ...elementProps
  } = props

  const translationAsSanitizedInnerHTML = useTranslationAsSanitizedInnerHTML({
    count,
    msgctxt,
    msgid,
    msgidPlural,
    params
  })

  return createElement(renderAs, {
    ...elementProps,
    children: null,
    dangerouslySetInnerHTML: translationAsSanitizedInnerHTML
  })
}

export function useTranslator() {
  return useContext(TranslatorContext)
}

function createTranslatorContext(
  locale: string,
  sourceLocale?: string,
  isDebugEnabled?: boolean,
  translations?: object
): TranslatorContext {
  const translator = createTranslator(
    locale,
    sourceLocale,
    isDebugEnabled,
    translations
  )

  return {
    locale,
    gettext: (msgid, ...args) => format(translator.gettext(msgid), ...args),
    pgettext: (msgctxt, msgid, ...args) =>
      format(translator.pgettext(msgctxt, msgid), ...args),
    ngettext: (msgid, msgidPlural, count, ...args) =>
      format(translator.ngettext(msgid, msgidPlural, count), ...args),
    npgettext: (msgctxt, msgid, msgidPlural, count, ...args) =>
      format(translator.npgettext(msgctxt, msgid, msgidPlural, count), ...args)
  }
}

function createTranslator(
  locale: string,
  sourceLocale?: string,
  isDebugEnabled?: boolean,
  translations?: object
) {
  const translator = new GetText({ debug: isDebugEnabled, sourceLocale })

  if (translations) {
    translator.addTranslations(locale, translator.domain, translations)
  }

  translator.setLocale(locale)

  return translator
}

function isArrayOfParams(
  params: Array<{ [k: string]: any } | string> | { [k: string]: any } | string
): params is Array<{ [k: string]: any } | string> {
  return Array.isArray(params)
}

function useTranslation(options: TranslateOptions) {
  const { count, msgctxt, msgid, msgidPlural, params = [] } = options
  const translator = useTranslator()
  const baseParamsArray = isArrayOfParams(params) ? params : [params]
  const paramsArrayRef = useRef(baseParamsArray)

  if (!shallowEqual(baseParamsArray, paramsArrayRef.current)) {
    paramsArrayRef.current = baseParamsArray
  }

  const { current: paramsArray } = paramsArrayRef

  return useMemo(() => {
    if (msgctxt == null) {
      return msgidPlural != null && count != null
        ? translator.ngettext(msgid, msgidPlural, count, ...paramsArray)
        : translator.gettext(msgid, ...paramsArray)
    }

    return msgidPlural != null && count != null
      ? translator.npgettext(msgctxt, msgid, msgidPlural, count, ...paramsArray)
      : translator.pgettext(msgctxt, msgid, ...paramsArray)
  }, [translator, count, msgctxt, msgid, msgidPlural, paramsArray])
}

function useTranslationAsSanitizedInnerHTML(options: TranslateOptions) {
  const translation = useTranslation(options)

  return useMemo(() => ({ __html: sanitize(translation) }), [translation])
}

export {
  TranslateProps,
  TranslatorProviderProps,
  HTMLTranslateProps
}