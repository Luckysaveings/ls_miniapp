// src/i18n-utils.js
// import { useI18n } from "vue-i18n";
import i18n from "./index";
import Cookies from "js-cookie";
import { Locale } from "vant";

export function useCustomI18n() {
  const { t, locale } = i18n.global;

  return {
    i18nTFn: t,
    locale,
  };
}
// 添加语言切换函数
export function switchLanguage(lang) {
  if (i18n.global.availableLocales.includes(lang)) {
    i18n.global.locale.value = lang;
    Cookies.set("language", lang);
    // 同时更新vant组件库的语言
    Locale.use(lang, i18n.global.messages.value[lang]);

    return true;
  }
  return false;
}
// 获取当前可用的语言列表
export function getAvailableLanguages() {
  return i18n.global.availableLocales;
}

export const globalTFn = i18n.global.t;
