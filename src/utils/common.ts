import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { showLoadingToast } from "vant";

// 钱包地址处理方法
export function formatWalletAddress(value: any, startLength:number = 6, endLength: number = 4) {
  if (!value) return ''
  const startChar = value.toString().substr(0, startLength)
  const endChar = value.toString().substr(value.toString().length - endLength)
  return `${startChar}...${endChar}`
};
// 一个金额处理方法，数字不超过10000时原样显示，数字超过10000除以1000，保留2位小数，单位为k
export const formatAmount = (amount: number): string => {
  amount = Math.floor(Number(amount) * 100) / 100;
  if (amount <= 10000) {
    return amount.toString();
  }
  const formattedAmount = Math.floor(amount / 10) / 100;
  return `${formattedAmount}K`;
};
/**
 * @description 计算当前时间点距指定 UTC 小时数的时间差
 * @param utcHours 指定的 UTC 小时数，距离现在不超过一天
 * @returns 时间差（毫秒）
 */
export const calculateTimeDifference = (utcHours: number): number => {
  dayjs.extend(utc);
  const now = dayjs();
  let target = dayjs.utc().hour(utcHours).minute(0).second(0).millisecond(0);

  // 确保目标时间在当前时间之后
  if (target.isBefore(now)) {
      target = target.add(1, 'day');
  }
  // 计算时间差
  return target.diff(now);
};
export const showToastBeforeRequest = () => {
  showLoadingToast({
    overlayClass: "http-loading-toast",
    overlay: true,
    message: "",
    forbidClick: true,
    duration: 0,
  });
}