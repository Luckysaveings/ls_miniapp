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

// 查看成就排行榜
export const getRanking = (params) => {
  console.log("查看", http.request);

  return http.request({
    url: "/task/ranking",
    method: "get",
    params,
  });
};
