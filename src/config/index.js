/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-19 13:27:23
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-23 17:46:03
 * @FilePath: /manger-front/config/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 环境配置封装
 */
const env = process.env.NODE_ENV || 'prod';
console.log('process.env', process.env);
const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi:
      'https://www.fastmock.site/mock/90ea6c3628a1622870e9dc491416df04/api',
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/90ea6c3628a1622870e9dc491416df04/api/users/getPermissionList',
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi:
      'https://www.fastmock.site/mock/90ea6c3628a1622870e9dc491416df04/api',
  },
};
export default {
  env,
  mock: false,
  namespace: 'manager',
  ...EnvConfig[env],
};
