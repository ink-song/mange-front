import request from '@/utils/request';

// 角色列表
export function getRolesListApi(data) {
  return request({
    url: '/roles/list',
    method: 'get',
    data,
  });
}

// 角色编辑/新增/删除
export function operateRolesApi(data) {
  return request({
    url: '/roles/operate',
    method: 'post',
    data,
  });
}

// 更新角色权限
export function updateRolesApi(data) {
  return request({
    url: '/roles/update/permission',
    method: 'post',
    data,
  });
}

// 获取所有角色权限
export function getAllRolesApi() {
  return request({
    url: '/roles/allList',
    method: 'get',
  });
}
