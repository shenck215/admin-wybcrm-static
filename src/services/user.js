import request from '../utils/request';

export async function info() {
  return request('/api/info');
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
