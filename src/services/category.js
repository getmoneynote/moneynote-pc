import { request } from '@umijs/max';

const prefix = 'categories';

export async function getAll() {
  return request(prefix, {
    method: 'GET',
    params: {
      enable: true,
    },
  });
}

export async function query(params) {
  return request(prefix, {
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

export async function toggle(id) {
  return request(prefix + '/' + id + '/toggle', {
    method: 'PUT',
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
