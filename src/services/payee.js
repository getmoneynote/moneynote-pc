import { request } from '@umijs/max';

const prefix = 'payees';

export async function toggleCanExpense(id) {
  return request(`${prefix}/${id}/toggleCanExpense`, {
    method: 'PATCH',
  });
}

export async function toggleCanIncome(id) {
  return request(`${prefix}/${id}/toggleCanIncome`, {
    method: 'PATCH',
  });
}
