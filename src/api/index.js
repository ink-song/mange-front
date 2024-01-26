/*
 * @Author: ink-song 229135518@qq.com
 * @Date: 2024-01-20 22:40:31
 * @LastEditors: ink-song 229135518@qq.com
 * @LastEditTime: 2024-01-26 11:09:29
 * @FilePath: /manger-front/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

// 菜单列表
export function getMenuList() {
  return request({
    url: '/users/getPermissionList',
    method: 'get',
    mock: true,
  });
}

// 用户列表
export function getUserListApi(data) {
  return request({
    url: '/users/list',
    method: 'get',
    data,
  });
}

// 用户删除
export function deleteUserApi(data) {
  return request({
    url: '/users/delete',
    method: 'post',
    data,
  });
}

// 用户编辑/新增
export function operateUserApi(data) {
  return request({
    url: '/users/operate',
    method: 'post',
    data,
  });
}

// 获取所有用户
export function getAllUserApi(data) {
  return request({
    url: '/users/all/list',
    method: 'get',
    data,
    mock: true,
  });
}
