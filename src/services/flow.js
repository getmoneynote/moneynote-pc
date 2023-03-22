import { request } from '@umijs/max';

const prefix = 'balance-flows';

export async function query(params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}

export async function statistics(params) {
  return request(prefix + '/statistics', {
    method: 'GET',
    params: params,
  });
}

export async function create(data) {
  return request(prefix, {
    method: 'POST',
    data: data,
  });
}

export async function update(id, data) {
  return request(prefix + '/' + id, {
    method: 'PUT',
    data: data,
  });
}

export async function remove(id) {
  return request(prefix + '/' + id, {
    method: 'DELETE',
  });
}

export async function confirm(id) {
  return request(prefix + '/confirm/' + id, {
    method: 'PUT',
  });
}
