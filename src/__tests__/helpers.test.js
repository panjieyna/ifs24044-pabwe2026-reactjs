import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  apiFetch,
} from '../helpers/apiHelper';
import {
  formatDate,
  coverUrl,
  photoUrl,
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
} from '../helpers/toolsHelper';

vi.mock('sweetalert2/dist/sweetalert2.js', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}));

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ status: 'success', data: { ok: true } }),
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('token helpers', () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken('abc');
    expect(getAccessToken()).toBe('abc');
    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
    putAccessToken('x');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it('apiFetch GET with params', async () => {
    const data = await apiFetch('/lost-founds', {
      params: { q: 'dompet', empty: '', skip: null },
    });
    expect(data.status).toBe('success');
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('q=dompet');
  });

  it('apiFetch bearer token', async () => {
    putAccessToken('tok');
    await apiFetch('/users/me');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
  });

  it('apiFetch auth false', async () => {
    putAccessToken('tok');
    await apiFetch('/auth/login', {
      method: 'POST',
      body: { email: 'a@b.c', password: 'x' },
      auth: false,
    });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('apiFetch throws on fail', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () =>
        Promise.resolve({ status: 'fail', message: 'Unauthenticated' }),
    });
    await expect(apiFetch('/users/me')).rejects.toThrow('Unauthenticated');
  });

  it('apiFetch formData and invalid json', async () => {
    const fd = new FormData();
    fd.append('cover', new Blob(['x']));
    await apiFetch('/x', { method: 'POST', body: fd, isFormData: true });
    expect(fetch.mock.calls[0][1].headers['Content-Type']).toBeUndefined();

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('bad')),
    });
    await expect(apiFetch('/y')).rejects.toThrow();
  });

  it('apiFetch path without leading slash', async () => {
    await apiFetch('users');
    expect(fetch.mock.calls[0][0]).toContain('/users');
  });
});

describe('toolsHelper', () => {
  it('formatDate', () => {
    expect(formatDate()).toBe('-');
    expect(formatDate(null)).toBe('-');
    expect(typeof formatDate('2024-10-05T03:07:11.000Z')).toBe('string');
  });

  it('coverUrl photoUrl', () => {
    expect(coverUrl(null)).toBeNull();
    expect(coverUrl('http://x.com/a.jpg')).toBe('http://x.com/a.jpg');
    expect(coverUrl('img/a.jpg')).toContain('open-api.delcom.org');
    expect(photoUrl(null)).toBeNull();
    expect(photoUrl('http://x.com/p.jpg')).toBe('http://x.com/p.jpg');
    expect(photoUrl('img/p.jpg')).toContain('open-api.delcom.org');
  });

  it('dialogs', async () => {
    await showSuccessDialog('ok');
    await showErrorDialog('err');
    await showWarningDialog('warn');
    const r = await showConfirmDialog('yakin?');
    expect(r.isConfirmed).toBe(true);
  });
});
