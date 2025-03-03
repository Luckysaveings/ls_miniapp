import Axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type AxiosRequestConfig } from "axios";
import { useRouter } from "vue-router"; // 添加这行导入

import { ContentTypeEnum } from "@/enums/request-enum";
import NProgress from "../progress";
import { showFailToast, showLoadingToast, closeToast } from "vant";
import "vant/es/toast/style";
import { useGlobalStore } from "@/store/globalStore";
// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.JSON,
  },
  timeout: 0,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {},
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      (config) => {
        NProgress.start();
        showLoadingToast({
          message: "",
          forbidClick: true,
          duration: 0,
        });
        const globalStore = useGlobalStore();
        // 发送请求前，可在此携带 token
        if (globalStore.token) {
          config.headers["x-token"] = globalStore.token;
        }
        // TODO token 过期，自动刷新 token
        // config.headers["Authorization"] =
        // `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiY2ZlODBiZWMtYjliOC00MTRkLTgyYTMtNWVhOTk5OGI4MDc5IiwiSUQiOjYsIlVzZXJuYW1lIjoiVWFjNTMxZTQxNDhkZjZlMmU1YmFhNzUxNTZiM2U4YzhmIiwiTmlja05hbWUiOiJvZ2dyciIsIkF1dGhvcml0eUlkIjoxMDAsIkJ1ZmZlclRpbWUiOjg2NDAwLCJpc3MiOiJxbVBsdXMiLCJhdWQiOlsiR1ZBIl0sImV4cCI6MTc0MDY2Njk3MCwibmJmIjoxNzQwMDYyMTcwfQ.pLgUOYSSaulttuzXDUV_RMP5OxHKTkEWw75UclhWDmo`;
        // console.log("config interceptors.request", config);

        return config;
      },
      (error: AxiosError) => {
        closeToast();
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        NProgress.done();
        closeToast();
        // console.log("response interceptors.response", response);
        // 与后端协定的返回字段
        const { code } = response.data;
        // const { message } = response.data;
        // 判断请求是否成功
        const isSuccess = code === 0;
        if (isSuccess) {
          return response.data;
        } else {
          // 处理请求错误
          // showFailToast(message);
          const router = useRouter();
          router.push({
            name: "error",
            query: {
              code: code.toString(),
            },
          });
          return Promise.reject(response.data);
        }
      },
      (error: AxiosError) => {
        const router = useRouter();
        NProgress.done();
        closeToast();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "请求错误";
            break;
          case 401:
            message = "未授权，请登录";
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "请求超时";
            break;
          case 500:
            message = "服务器内部错误";
            break;
          case 501:
            message = "服务未实现";
            break;
          case 502:
            message = "网关错误";
            break;
          case 503:
            message = "服务不可用";
            break;
          case 504:
            message = "网关超时";
            break;
          case 505:
            message = "HTTP版本不受支持";
            break;
          default:
            message = "网络连接故障";
        }

        showFailToast(message);
        // 跳转到错误页面
        router.push({
          name: "error",
          query: {
            message: message,
            status: status?.toString(),
          },
        });
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);

export default http.request;
