import request from '@/utils/request';

// 部门列表
export function getDeptListApi(data) {
  return request({
    url: '/dept/list',
    method: 'get',
    data,
  });
}

// 新增/编辑/删除部门
export function operateDeptApi(data) {
  return request({
    url: '/dept/operate',
    method: 'post',
    data,
  });
}
