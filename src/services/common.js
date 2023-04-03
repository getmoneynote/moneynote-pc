import {request} from "@umijs/max";

export async function create(prefix, data) {
  return request(prefix, {
    method: 'POST',
    data: data,
  });
}

export async function query(prefix, params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}

export async function update(prefix, id, data) {
  return request(`${prefix}/${id}`, {
    method: 'PUT',
    data: data,
  });
}

export async function remove(prefix, id) {
  return request(`${prefix}/${id}`, {
    method: 'DELETE',
  });
}

export async function getAll(prefix, bookId) {
  return request(`${prefix}/all`, {
    method: 'GET',
    params: {
      'bookId': bookId,
    },
  });
}

export async function queryAll(prefix, params) {
  const response = await request(`${prefix}/all`, {
    method: 'GET',
    params: params,
  });
  return response.data;
}

export async function toggle(prefix, id) {
  return request(`${prefix}/${id}/toggle`, {
    method: 'PATCH',
  });
}
