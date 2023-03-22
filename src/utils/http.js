import axios from 'axios';

const config = {
  baseURL: "/templates",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

const instance = axios.create(config);

export const post = async (url, data) => {
  return await instance.post(url, data).then(response => {
    return response;
  }).catch(error => {
    return error;
  });
}

export const get = async (url, params) => {
  return await instance.get(url, {params: params}).then(response => {
    console.log(response);
    return response;
  }).catch(error => {
    return error;
  });
}
