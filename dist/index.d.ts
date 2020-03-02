import React from 'react';
import { HTMLTranslateProps, TranslateProps, TranslatorContext, TranslatorProviderProps } from './types';
declare const TranslatorContext: React.Context<TranslatorContext>;
export declare function TranslatorProvider(props: TranslatorProviderProps): JSX.Element;
export declare function Translate(props: TranslateProps): JSX.Element;
export declare function HTMLTranslate<T extends keyof JSX.IntrinsicElements>(props: HTMLTranslateProps<T>): React.DOMElement<Pick<HTMLTranslateProps<T>, Exclude<keyof JSX.IntrinsicElements[T], "count" | "msgctxt" | "msgid" | "msgidPlural" | "params" | "comments" | "renderAs">> & {
    children: null;
    dangerouslySetInnerHTML: {
        __html: string;
    };
}, SVGViewElement>;
export declare function useTranslator(): TranslatorContext;
export { TranslateProps, TranslatorProviderProps, HTMLTranslateProps };
