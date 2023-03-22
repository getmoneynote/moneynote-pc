import { request } from '@umijs/max';

const prefix = 'note-days';

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

export async function runOnce(id, json) {
  return request(prefix + '/run/' + id, {
    method: 'PUT',
    data: json,
  });
}

export async function recall(id, json) {
  return request(prefix + '/recall/' + id, {
    method: 'PUT',
    data: json,
  });
}
