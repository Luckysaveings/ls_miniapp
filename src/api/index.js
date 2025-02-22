import { http } from "@/utils/http";

// 用户登录
export const login = (data) => {
  return http.request({
    url: "/base/lineLogin",
    method: "post",
    data,
  });
};
// 获取任务列表
export const getTaskList = (params) => {
  return http.request({
    url: "/task/getLsTaskListWithStatus",
    method: "get",
    params,
  });
};

// 任务状态检查
export const checkTask = (id) => {
  return http.request({
    url: `/task/check/${id}`,
    method: "post",
  });
};

// 任务领取
export const claimTask = (id) => {
  return http.request({
    url: `/task/claim/${id}`,
    method: "post",
  });
};
// 查看成就排行榜
export const getRanking = (params) => {
  return http.request({
    url: "/task/ranking",
    method: "get",
    params,
  });
};

// 查看用户已获取成就
export const getAchievement = () => {
  return http.request({
    url: "/task/getLsTaskRewardBalance",
    method: "get",
  });
};
// 查看用户当前成就排名
export const getMyRanking = (param) => {
  return http.request({
    url: `/task/getUserRanking/${param.type}`,
    method: "get",
  });
};
// 查看奖池开奖记录
export const getLotteryRecord = (params) => {
  return http.request({
    url: "/draw/getLsDrawLogListByPoolId",
    method: "get",
    params,
  });
};
// 查看充值提现记录
export const getRechargeRecord = (params) => {
  return http.request({
    url: "/tx/records",
    method: "get",
    params,
  });
};
// 添加交易记录
export const addTxRecord = (data) => {
  return http.request({
    url: "/tx/createLsTx",
    method: "post",
    data,
  });
};
// 绑定钱包
export const bindWallet = (data) => {
  return http.request({
    url: "/wallet/createLs_wallet",
    method: "post",
    data,
  });
};
// 查询所有奖池信息
export const getPoolList = (params) => {
  return http.request({
    url: "/pool/getLsPoolList",
    method: "get",
    params,
  });
};
