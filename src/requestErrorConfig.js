import { message } from 'antd';
import qs from 'qs';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig = {
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem("umi_locale") ?? 'zh-CN',
    'Authorization': `Bearer ${localStorage.getItem("accessToken") ?? ''}`,
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error, opts) => {
      if (opts?.skipErrorHandler) throw error;
      console.log(error);
      // if (error.response.data?.message) {
      //   message.error(error.response.data?.message)
      // }
    },
  },

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data, config } = response;
      if (config.skipErrorHandler) return response;
      if (data.showType === 4) {
        message.success(data.message);
      }
      if (data.showType === 2) {
        message.error(data.message);
        return Promise.reject(data)
      }
      return response;
    },
  ],
};
