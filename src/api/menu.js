import request from '@/utils/request';

// 新增/编辑/删除菜单
export function operateMenuApi(data) {
  return request({
    url: '/menu/operate',
    method: 'post',
    data,
    mock: false,
  });
}

// 获取菜单所有列表
export function getMenuListApi() {
  return request({
    url: '/menu/list',
    method: 'get',
  });
}

// 获取菜单权限树
export function getPermissionTreeApi() {
  return request({
    url: '/users/getPermissionList',
    method: 'get',
  });
}
