import { request } from '@umijs/max';

const prefix = 'books';

export async function createByTemplate(data) {
  return request(`${prefix}/template`, {
    method: 'POST',
    data: data,
  });
}
