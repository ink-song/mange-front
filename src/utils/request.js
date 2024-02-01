/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-18 14:50:59
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-02-01 11:46:36
 * @FilePath: /manage-fe/src/utils/request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import md5 from 'md5';
import { ElMessage } from 'element-plus';
import config from '@/config/index';
import { getStorage } from './storage';
import router from '../router';
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 80000,
});

const TOKEN_INVALID = 'Token认证失败，请重新登录';
const NETWORK_ERROR = '网络请求异常，请稍后重试';

// 请求拦截
service.interceptors.request.use((config) => {
  const { icode, time } = getTestICode();
  config.headers.codeType = time;
  config.headers.icode = icode;
  const { token = '' } = getStorage('userInfo') || {};
  if (!config.headers.Authorization)
    config.headers.Authorization = 'Bearer ' + token;
  return config;
});

// 响应器拦截
service.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 200) {
      return data;
    } else if (data.code === 50001) {
      ElMessage.error(TOKEN_INVALID);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return Promise.reject(TOKEN_INVALID);
    } else {
      ElMessage.error(data.msg || NETWORK_ERROR);
      return Promise.reject(data.msg || NETWORK_ERROR);
    }
  },
  (error) => {
    if (error?.response?.data) {
      const { message, code } = error?.response?.data;
      ElMessage.error(message);
    }
    return Promise.reject(error);
  },
);

/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  options.method = options.method || 'get';
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data;
  }
  let isMock = config.mock;
  if (typeof options.mock != 'undefined') {
    isMock = options.mock;
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});

function getTestICode() {
  const now = parseInt(Date.now() / 1000);
  const code = now + 'LGD_Sunday-1991-12-30';
  return {
    icode: md5(code),
    time: now,
  };
}

export default request;
