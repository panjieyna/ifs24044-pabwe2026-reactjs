import { apiFetch } from '../../../helpers/apiHelper';

export async function getUsers() {
  return apiFetch('/users');
}

export async function getUserById(id) {
  return apiFetch(`/users/${id}`);
}

export async function getProfile() {
  return apiFetch('/users/me');
}

export async function updateProfile({ name, email }) {
  return apiFetch('/users/me', {
    method: 'PUT',
    body: { name, email },
  });
}

export async function changePhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  return apiFetch('/users/me/photo', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}

export async function changePassword({
  password,
  new_password,
  new_password_confirmation,
}) {
  return apiFetch('/users/password', {
    method: 'PUT',
    body: { password, new_password, new_password_confirmation },
  });
}