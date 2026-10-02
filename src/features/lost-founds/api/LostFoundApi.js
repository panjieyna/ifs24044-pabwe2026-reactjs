import { apiFetch } from '../../../helpers/apiHelper';

export async function getLostFounds(params = {}) {
  return apiFetch('/lost-founds', { params });
}

export async function getLostFoundById(id) {
  return apiFetch(`/lost-founds/${id}`);
}

export async function addLostFound({ title, description, status }) {
  return apiFetch('/lost-founds', {
    method: 'POST',
    body: { title, description, status },
  });
}

export async function updateLostFound(
  id,
  { title, description, status, is_completed }
) {
  return apiFetch(`/lost-founds/${id}`, {
    method: 'PUT',
    body: { title, description, status, is_completed },
  });
}

export async function changeCover(id, file) {
  const formData = new FormData();
  formData.append('cover', file);
  return apiFetch(`/lost-founds/${id}/cover`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}

export async function deleteLostFound(id) {
  return apiFetch(`/lost-founds/${id}`, { method: 'DELETE' });
}

export async function getStatsDaily(params = {}) {
  return apiFetch('/lost-founds/stats/daily', { params });
}

export async function getStatsMonthly(params = {}) {
  return apiFetch('/lost-founds/stats/monthly', { params });
}