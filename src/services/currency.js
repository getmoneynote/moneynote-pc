import { request } from '@umijs/max';

const prefix = 'currencies';

export async function refresh() {
  return request(`${prefix}/refresh`, {
    method: 'POST',
  });
}

export async function rate(from, to) {
  return request(`${prefix}/rate`, {
    method: 'GET',
    params: {
      from: from,
      to: to,
    },
  });
}
