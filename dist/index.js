"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslator = exports.HTMLTranslate = exports.Translate = exports.TranslatorProvider = void 0;
var react_1 = __importStar(require("react"));
var string_format_1 = __importDefault(require("string-format"));
var node_gettext_1 = __importDefault(require("node-gettext"));
var shallowequal_1 = __importDefault(require("shallowequal"));
var sanitize_html_1 = __importDefault(require("sanitize-html"));
var DEFAULT_HTML_CONTAINER_TYPE = 'span';
var TranslatorContext = react_1.createContext(null);
function TranslatorProvider(props) {
    var children = props.children, isDebugEnabled = props.isDebugEnabled, locale = props.locale, sourceLocale = props.sourceLocale, translations = props.translations;
    var translatorContext = react_1.useMemo(function () {
        return createTranslatorContext(locale, sourceLocale, isDebugEnabled, translations);
    }, [locale, sourceLocale, isDebugEnabled, translations]);
    var finalChildren = react_1.useMemo(function () {
        return typeof children === 'function' ? children(translatorContext) : children;
    }, [children, translatorContext]);
    return (react_1.default.createElement(TranslatorContext.Provider, { value: translatorContext }, finalChildren));
}
exports.TranslatorProvider = TranslatorProvider;
function Translate(props) {
    var count = props.count, msgctxt = props.msgctxt, msgid = props.msgid, msgidPlural = props.msgidPlural, params = props.params;
    var translation = useTranslation({
        count: count,
        msgctxt: msgctxt,
        msgid: msgid,
        msgidPlural: msgidPlural,
        params: params
    });
    return react_1.default.createElement(react_1.default.Fragment, null, translation);
}
exports.Translate = Translate;
function HTMLTranslate(props) {
    var count = props.count, msgctxt = props.msgctxt, msgid = props.msgid, msgidPlural = props.msgidPlural, params = props.params, comments = props.comments, _a = props.renderAs, renderAs = _a === void 0 ? DEFAULT_HTML_CONTAINER_TYPE : _a, elementProps = __rest(props, ["count", "msgctxt", "msgid", "msgidPlural", "params", "comments", "renderAs"]);
    var translationAsSanitizedInnerHTML = useTranslationAsSanitizedInnerHTML({
        count: count,
        msgctxt: msgctxt,
        msgid: msgid,
        msgidPlural: msgidPlural,
        params: params
    });
    return react_1.createElement(renderAs, __assign(__assign({}, elementProps), { children: null, dangerouslySetInnerHTML: translationAsSanitizedInnerHTML }));
}
exports.HTMLTranslate = HTMLTranslate;
function useTranslator() {
    return react_1.useContext(TranslatorContext);
}
exports.useTranslator = useTranslator;
function createTranslatorContext(locale, sourceLocale, isDebugEnabled, translations) {
    var translator = createTranslator(locale, sourceLocale, isDebugEnabled, translations);
    return {
        locale: locale,
        gettext: function (msgid) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return string_format_1.default.apply(void 0, __spreadArrays([translator.gettext(msgid)], args));
        },
        pgettext: function (msgctxt, msgid) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return string_format_1.default.apply(void 0, __spreadArrays([translator.pgettext(msgctxt, msgid)], args));
        },
        ngettext: function (msgid, msgidPlural, count) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            return string_format_1.default.apply(void 0, __spreadArrays([translator.ngettext(msgid, msgidPlural, count)], args));
        },
        npgettext: function (msgctxt, msgid, msgidPlural, count) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            return string_format_1.default.apply(void 0, __spreadArrays([translator.npgettext(msgctxt, msgid, msgidPlural, count)], args));
        }
    };
}
function createTranslator(locale, sourceLocale, isDebugEnabled, translations) {
    var translator = new node_gettext_1.default({ debug: isDebugEnabled, sourceLocale: sourceLocale });
    if (translations) {
        translator.addTranslations(locale, translator.domain, translations);
    }
    translator.setLocale(locale);
    return translator;
}
function isArrayOfParams(params) {
    return Array.isArray(params);
}
function useTranslation(options) {
    var count = options.count, msgctxt = options.msgctxt, msgid = options.msgid, msgidPlural = options.msgidPlural, _a = options.params, params = _a === void 0 ? [] : _a;
    var translator = useTranslator();
    var baseParamsArray = isArrayOfParams(params) ? params : [params];
    var paramsArrayRef = react_1.useRef(baseParamsArray);
    if (!shallowequal_1.default(baseParamsArray, paramsArrayRef.current)) {
        paramsArrayRef.current = baseParamsArray;
    }
    var paramsArray = paramsArrayRef.current;
    return react_1.useMemo(function () {
        if (msgctxt == null) {
            return msgidPlural != null && count != null
                ? translator.ngettext.apply(translator, __spreadArrays([msgid, msgidPlural, count], paramsArray)) : translator.gettext.apply(translator, __spreadArrays([msgid], paramsArray));
        }
        return msgidPlural != null && count != null
            ? translator.npgettext.apply(translator, __spreadArrays([msgctxt, msgid, msgidPlural, count], paramsArray)) : translator.pgettext.apply(translator, __spreadArrays([msgctxt, msgid], paramsArray));
    }, [translator, count, msgctxt, msgid, msgidPlural, paramsArray]);
}
function useTranslationAsSanitizedInnerHTML(options) {
    var translation = useTranslation(options);
    return react_1.useMemo(function () { return ({ __html: sanitize_html_1.default(translation) }); }, [translation]);
}
