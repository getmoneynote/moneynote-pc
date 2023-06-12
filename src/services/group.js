import { request } from '@umijs/max';

const prefix = 'groups';

export async function inviteUser(id, username) {
  return request(`${prefix}/${id}/inviteUser`, {
    method: 'POST',
    data: {
      username: username
    }
  });
}

export async function removeUser(id, userId) {
  return request(`${prefix}/${id}/removeUser`, {
    method: 'POST',
    data: {
      userId: userId
    }
  });
}

export async function agree(id) {
  return request(`${prefix}/${id}/agree`, {
    method: 'POST',
  });
}

export async function reject(id) {
  return request(`${prefix}/${id}/reject`, {
    method: 'POST',
  });
}

export async function getUsers(id) {
  return request(`${prefix}/${id}/users`, {
    method: 'GET',
  });
}
