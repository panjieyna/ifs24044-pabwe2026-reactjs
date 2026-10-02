const BASE_URL =
  typeof DELCOM_BASEURL !== 'undefined'
    ? DELCOM_BASEURL
    : 'https://open-api.delcom.org/api/v1';

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function putAccessToken(token) {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

/**
 * Wrapper fetch ke REST API Delcom.
 * @param {string} path
 * @param {object} options
 */
export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body = null,
    params = null,
    isFormData = false,
    auth = true,
  } = options;

  let url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  if (params && typeof params === 'object') {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.append(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  } else {
    headers['Accept'] = 'application/json';
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions = { method, headers };

  if (body !== null && body !== undefined) {
    fetchOptions.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  let data;
  try {
    data = await response.json();
  } catch {
    data = { status: 'fail', message: 'Respons tidak valid' };
  }

  if (!response.ok || data.status === 'fail') {
    const error = new Error(data.message || 'Terjadi kesalahan');
    error.data = data.data || null;
    error.status = data.status || 'fail';
    throw error;
  }

  return data;
}