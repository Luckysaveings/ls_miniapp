import Axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type AxiosRequestConfig } from "axios";
import { useRouter } from "vue-router"; // 添加这行导入

import { ContentTypeEnum } from "@/enums/request-enum";
import NProgress from "../progress";
import { showToast, showFailToast, showLoadingToast, closeToast } from "vant";
import "vant/es/toast/style";
import { useGlobalStore } from "@/store/globalStore";
// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.JSON,
  },
  timeout: 10000,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {},
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;
  // 请求计数器
  // private static requestCount = 0;
  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      (config) => {
        NProgress.start();
        // 如果是第一个请求，显示loading
        // if (Http.requestCount < 1) {
        //   NProgress.start();
        //   showLoadingToast({
        //     overlayClass: "http-loading-toast",
        //     overlay: true,
        //     message: "",
        //     forbidClick: true,
        //     duration: 0,
        //   });
        // }
        // Http.requestCount++;
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
        // 如果所有请求都结束了，关闭loading
        // closeToast();
        NProgress.done();
        // if (Http.requestCount < 1) {
        //   closeToast();
        //   NProgress.done();
        // }

        showToast({
          message: error.message,
          overlay: true,
          closeOnClick: true,
          closeOnClickOverlay: true,
          duration: 3000,
          className: "custom-toast content-box",
        });
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Http.requestCount--;
        // 如果所有请求都结束了，关闭loading
        // if (Http.requestCount < 1) {
        //   closeToast();
        //   NProgress.done();
        // }
        NProgress.done();
        // console.log("response interceptors.response", response);
        // 与后端协定的返回字段
        const { code, msg } = response.data;
        // const { message } = response.data;
        // 判断请求是否成功
        const isSuccess = code === 0;
        if (isSuccess) {
          return response.data;
        } else {
          let message = "Network Error, Please try again later.";
          if (code === 7 && msg) {
            message = msg;
          }
          // 处理请求错误
          showToast({
            message: message,
            overlay: true,
            closeOnClick: true,
            closeOnClickOverlay: true,
            duration: 3000,
            className: "custom-toast content-box",
          });
          // const router = useRouter();
          // if (!router) return;
          // router.push({
          //   name: "error",
          //   query: {
          //     code: code.toString(),
          //   },
          // });
          return Promise.reject(response?.data);
        }
      },
      (error: AxiosError) => {
        const router = useRouter();
        // 如果所有请求都结束了，关闭loading
        // if (Http.requestCount < 1) {
        //   closeToast();
        //   NProgress.done();
        // }
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = "Bad Request";
            break;
          case 401:
            message = "Unauthorized, please log in";
            break;
          case 403:
            message = "Forbidden";
            break;
          case 404:
            message = `Request URL error: ${error.response?.config?.url}`;
            break;
          case 408:
            message = "Request Timeout";
            break;
          case 500:
            message = "Internal Server Error";
            break;
          case 501:
            message = "Not Implemented";
            break;
          case 502:
            message = "Bad Gateway";
            break;
          case 503:
            message = "Service Unavailable";
            break;
          case 504:
            message = "Gateway Timeout";
            break;
          case 505:
            message = "HTTP Version Not Supported";
            break;
          default:
            message = "Network Connection Error";
        }

        showToast({
          message: "Network Error, Please try again later.",
          overlay: true,
          closeOnClick: true,
          closeOnClickOverlay: true,
          duration: 3000,
          className: "custom-toast content-box",
        });
        if (!router) return;
        // 跳转到错误页面
        // router.push({
        //   name: "error",
        //   query: {
        //     message: message,
        //     status: status?.toString(),
        //   },
        // });
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
