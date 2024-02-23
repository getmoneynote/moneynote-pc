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

export async function exportFlow(id, offset) {
  return request(`${prefix}/${id}/export?timeZoneOffset=${offset}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

export async function queryBookTemplates(lang) {
  return request('book-templates', {
    method: 'GET',
    params: {
      lang: lang
    },
  });
}

export async function allBookTemplates(lang) {
  return request('book-templates/all', {
    method: 'GET',
    params: {
      lang: lang
    },
  });
}







