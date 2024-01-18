import { request  } from "@umijs/max";

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

// 查询可用的
export async function query1(prefix, params) {
  return request(prefix, {
    method: 'GET',
    params: {
      ...params,
      ...{
        enable: true
      }
    },
  });
}

// 回收站查询
export async function query2(prefix, params) {
  return request(prefix, {
    method: 'GET',
    params: {
      ...params,
      ...{
        enable: false
      }
    },
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

export async function queryAll(prefix, params) {
  return await request(`${prefix}/all`, {
    method: 'GET',
    params: params,
  });
}

export async function toggle(prefix, id) {
  return request(`${prefix}/${id}/toggle`, {
    method: 'PATCH',
  });
}

export async function apiVersion() {
  return request('version', {
    method: 'GET',
  });
}

