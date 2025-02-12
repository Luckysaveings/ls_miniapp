// src/i18n-utils.js
import { useI18n } from "vue-i18n";
import i18n from "./index";

export function useCustomI18n() {
  const { t, locale } = useI18n();

  return {
    i18nTFn: t,
    locale,
  };
}

export const globalTFn = i18n.global.t;
