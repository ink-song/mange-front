import request from '@/utils/request';

export function getApproveListApi(data) {
  return request({
    url: '/approve/list',
    method: 'get',
    data,
    mock: true,
  });
}

// 操作
export function operateApproveApi(data) {
  return request({
    url: '/leave/operate',
    method: 'post',
    data,
    mock: true,
  });
}
