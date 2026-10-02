import { apiFetch } from '../../../helpers/apiHelper';

export async function login({ email, password }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function register({ name, email, password }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  });
}

export async function logout() {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
}