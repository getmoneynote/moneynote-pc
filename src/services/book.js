import { request } from '@umijs/max';

const prefix = 'books';

export async function createByTemplate(data) {
  return request(`${prefix}/template`, {
    method: 'POST',
    data: data,
  });
}

export async function copy(data) {
  return request(`${prefix}/copy`, {
    method: 'POST',
    data: data,
  });
}

export async function exportFlow(id) {
  return request(`${prefix}/${id}/export`, {
    method: 'GET',
    responseType: 'blob',
  });
}

export async function queryBookTemplates(params) {
  return request('book-templates', {
    method: 'GET',
    params: params,
  });
}
