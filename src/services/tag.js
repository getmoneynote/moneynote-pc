import { request } from '@umijs/max';

const prefix = 'tags';

export async function getAll() {
  return request(prefix, {
    method: 'GET',
    params: {
      enable: true,
    },
  });
}

export async function query(params) {
  return request(prefix, {
    method: 'GET',
    params: params
  });
}

export async function create(data) {
  return request(prefix, {
    method: 'POST',
    data: data,
  });
}

export async function toggle(id) {
  return request(prefix + '/' + id + '/toggle', {
    method: 'PUT',
  });
}

export async function toggleCanExpense(id) {
  return request(prefix + '/' + id + '/toggleCanExpense', {
    method: 'PUT',
  });
}

export async function toggleCanIncome(id) {
  return request(prefix + '/' + id + '/toggleCanIncome', {
    method: 'PUT',
  });
}

export async function toggleCanTransfer(id) {
  return request(prefix + '/' + id + '/toggleCanTransfer', {
    method: 'PUT',
  });
}

export async function update(id, data) {
  return request(prefix + '/' + id, {
    method: 'PUT',
    data: data,
  });
}

export async function remove(id) {
  return request(prefix + '/' + id, {
    method: 'DELETE',
  });
}
