import { request } from '@umijs/max';

const prefix = 'books';

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

export async function query(params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}

export async function remove(id) {
  return request(prefix + '/' + id, {
    method: 'DELETE',
  });
}

export async function toggle(id) {
  return request(prefix + '/' + id + '/toggle', {
    method: 'PUT',
  });
}

export async function getAll() {
  return request(prefix + '/all', {
    method: 'GET',
  });
}

export async function createByTemplate(data) {
  return request(prefix + '/template', {
    method: 'POST',
    data: data,
  });
}
