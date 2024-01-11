import { request } from '@umijs/max';

const prefix = 'reports';

export async function getExpenseCategory(params) {
  return request(`${prefix}/expense-category`, {
    method: 'GET',
    params: params,
  });
}

export async function getIncomeCategory(params) {
  return request(`${prefix}/income-category`, {
    method: 'GET',
    params: params,
  });
}

export async function getExpenseTag(params) {
  return request(`${prefix}/expense-tag`, {
    method: 'GET',
    params: params,
  });
}

export async function getIncomeTag(params) {
  return request(`${prefix}/income-tag`, {
    method: 'GET',
    params: params,
  });
}

export async function getExpensePayee(params) {
  return request(`${prefix}/expense-payee`, {
    method: 'GET',
    params: params,
  });
}

export async function getIncomePayee(params) {
  return request(`${prefix}/income-payee`, {
    method: 'GET',
    params: params,
  });
}

export async function balance() {
  return request(`${prefix}/balance`, {
    method: 'GET',
  });
}
