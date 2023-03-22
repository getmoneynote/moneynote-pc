import { request } from '@umijs/max';

const prefix = 'tag-relations';

export async function update(id, data) {
  return request(prefix + '/' + id, {
    method: 'PUT',
    data: data,
  });
}
