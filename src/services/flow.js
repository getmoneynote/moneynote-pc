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

export async function removeWithAccount(id) {
  return request(`${prefix}/${id}/deleteWithAccount`, {
    method: 'DELETE',
  });
}
