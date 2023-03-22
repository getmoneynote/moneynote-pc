import { request } from '@umijs/max';

const prefix = 'accounts';

export async function query(params) {
  return request(prefix, {
    method: 'GET',
    params: params,
  });
}

export async function statistics(params) {
  return request(prefix + '/statistics', {
    method: 'GET',
    params: params,
  });
}

export async function getAll() {
  return request(prefix + '/all', {
    method: 'GET',
  });
}

export async function create(data) {
  return request(prefix, {
    method: 'POST',
    data: data,
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

export async function toggle(id) {
  return request(prefix + '/' + id + '/toggle', {
    method: 'PUT',
  });
}

export async function toggleInclude(id) {
  return request(prefix + '/' + id + '/toggleInclude', {
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

export async function toggleCanTransferFrom(id) {
  return request(prefix + '/' + id + '/toggleCanTransferFrom', {
    method: 'PUT',
  });
}

export async function toggleCanTransferTo(id) {
  return request(prefix + '/' + id + '/toggleCanTransferTo', {
    method: 'PUT',
  });
}

export async function adjust(id, data) {
  return request(prefix + '/adjust/' + id, {
    method: 'POST',
    data: data,
  });
}

export async function overview() {
  return request(prefix + '/overview', {
    method: 'GET',
  });
}
