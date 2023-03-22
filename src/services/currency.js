import { request } from '@umijs/max';

const prefix = 'currency';

export async function getAll() {
  return request(prefix + '/all', {
    method: 'GET'
  });
}
