import { createI18n } from "vue-i18n";
import Cookies from "js-cookie";
import { Locale } from "vant";
// 引入英文语言包
import enUS from "vant/es/locale/lang/en-US";
import zhCN from "vant/es/locale/lang/zh-CN";
import enLocale from "./en";
import zhLocale from "./zh";

const messages = {
  en_US: {
    ...enUS,
    ...enLocale,
  },
  zh_CN: {
    ...zhCN,
    ...zhLocale,
  },
};

export function getLanguage() {
  console.log(":: getLanguage() ::");

  const chooseLanguage = Cookies.get("language");
  if (chooseLanguage) return chooseLanguage;
  else {
    Cookies.set("language", "en_US");
    return "en_US";
  }
}
const CURRENT_LANG = getLanguage();
Locale.use(CURRENT_LANG, messages[CURRENT_LANG]);
const i18n = createI18n({
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  // 设置语言 选项 en | zh
  locale: CURRENT_LANG,
  fallbackLocale: "en_US",
  // 设置文本内容
  messages,
});

export default i18n;
