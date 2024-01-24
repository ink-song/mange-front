import request from '@/utils/request';

// 操作菜单
export function operateMenuApi(data) {
  return request({
    url: '/menu/operate',
    method: 'post',
    data,
    mock: true,
  });
}

// 获取菜单所有列表

export function getMenuListApi() {
  return request({
    url: '/menu/list',
    method: 'get',
    mock: true,
  });
}
