import { request } from '@umijs/max';

const prefix = 'balance-flows';

export async function statistics(params) {
  return request(`${prefix}/statistics`, {
    method: 'GET',
    params: params,
  });
}

export async function confirm(id) {
  return request(`${prefix}/${id}/confirm`, {
    method: 'PATCH',
  });
}

export async function getFiles(id) {
  return request(`${prefix}/${id}/files`, {
    method: 'GET',
  });
}

export function buildUrl(file) {
  return `api/v1/flow-files/view?id=${file.id}&createTime=${file.createTime}`
}
