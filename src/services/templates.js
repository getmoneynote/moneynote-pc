import { request } from '@umijs/max';

const prefix = 'book-templates';

export async function query(params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}
