import request from '@/utils/request';

export function getApproveListApi(data) {
  return request({
    url: '/leave/list',
    method: 'get',
    data,
  });
}

// 作废和新增
export function operateApproveApi(data) {
  return request({
    url: '/leave/operate',
    method: 'post',
    data,
  });
}

// 驳回和通过

export function leaveApproveApi(data) {
  return request({
    url: '/leave/approve',
    method: 'post',
    data,
  });
}

// 获取审批数量

export function getApproveCountApi() {
  return request({
    url: '/leave/count',
    method: 'get',
  });
}
