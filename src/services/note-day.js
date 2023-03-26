import { request } from '@umijs/max';

const prefix = 'note-days';

export async function runOnce(id, json) {
  return request(`${prefix}/${id}/run`, {
    method: 'PATCH',
    data: json,
  });
}

export async function recall(id, json) {
  return request(`${prefix}/${id}/recall`, {
    method: 'PATCH',
    data: json,
  });
}
