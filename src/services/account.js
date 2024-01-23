import { request } from '@umijs/max';

const prefix = 'accounts';

export async function statistics(params) {
  return request(`${prefix}/statistics`, {
    method: 'GET',
    params: {
      ...params,
      ...{
        enable: true
      }
    },
  });
}

export async function toggleInclude(id) {
  return request(`${prefix}/${id}/toggleInclude`, {
    method: 'PATCH',
  });
}

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

export async function toggleCanTransferFrom(id) {
  return request(`${prefix}/${id}/toggleCanTransferFrom`, {
    method: 'PATCH',
  });
}

export async function toggleCanTransferTo(id) {
  return request(`${prefix}/${id}/toggleCanTransferTo`, {
    method: 'PATCH',
  });
}

export async function createAdjust(id, data) {
  return request(`${prefix}/${id}/adjust`, {
    method: 'POST',
    data: data,
  });
}

export async function updateAdjust(id, data) {
  return request(`${prefix}/${id}/adjust`, {
    method: 'PUT',
    data: data,
  });
}

export async function overview() {
  return request(`${prefix}/overview`, {
    method: 'GET',
  });
}
