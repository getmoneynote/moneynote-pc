import { request } from '@umijs/max';

export async function login(data) {
  return request('login', {
    method: 'POST',
    data: data,
  });
}

export async function logout() {
  return request('logout', {
    method: 'POST',
  });
}

export async function register(data) {
  return request('register', {
    method: 'POST',
    data: data,
  });
}

export async function bind(data) {
  return request('bind', {
    method: 'PUT',
    data: data,
  });
}

export async function changePassword(data) {
  return request('changePassword', {
    method: 'PATCH',
    data: data,
  });
}

export async function getInitState() {
  return request('initState', {
    method: 'GET',
  });
}

export async function setDefaultBook(id) {
  return request(`setDefaultBook/${id}`, {
    method: 'PATCH',
  });
}

export async function setDefaultGroup(id) {
  return request(`setDefaultGroup/${id}`, {
    method: 'PATCH',
  });
}

export async function setDefaultGroupAndBook(id) {
  return request(`setDefaultGroupAndBook/${id}`, {
    method: 'PATCH',
  });
}

export async function wxLoginUrl() {
  return request('loginWechat/url', {
    method: 'GET',
  });
}



