import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authApi from '../features/auth/api/authApi';
import * as userApi from '../features/users/api/userApi';
import * as lfApi from '../features/lost-founds/api/LostFoundApi';
import { apiFetch } from '../helpers/apiHelper';

vi.mock('../helpers/apiHelper', () => ({
  apiFetch: vi.fn(() => Promise.resolve({ status: 'success', data: {} })),
}));

describe('authApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('login register logout', async () => {
    await authApi.login({ email: 'a@b.c', password: 'x' });
    expect(apiFetch).toHaveBeenCalledWith(
      '/auth/login',
      expect.objectContaining({ method: 'POST', auth: false })
    );
    await authApi.register({ name: 'A', email: 'a@b.c', password: 'x' });
    expect(apiFetch).toHaveBeenCalledWith(
      '/auth/register',
      expect.objectContaining({ method: 'POST', auth: false })
    );
    await authApi.logout();
    expect(apiFetch).toHaveBeenCalledWith('/auth/logout', { method: 'POST' });
  });
});

describe('userApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('all endpoints', async () => {
    await userApi.getUsers();
    await userApi.getUserById(1);
    await userApi.getProfile();
    await userApi.updateProfile({ name: 'A', email: 'a@b.c' });
    await userApi.changePhoto(new File(['x'], 'a.jpg'));
    await userApi.changePassword({
      password: 'a',
      new_password: 'b',
      new_password_confirmation: 'b',
    });
    expect(apiFetch).toHaveBeenCalled();
    expect(apiFetch.mock.calls.length).toBeGreaterThanOrEqual(6);
  });
});

describe('LostFoundApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('all endpoints', async () => {
    await lfApi.getLostFounds({ is_me: 1 });
    await lfApi.getLostFoundById(5);
    await lfApi.addLostFound({
      title: 't',
      description: 'd',
      status: 'lost',
    });
    await lfApi.updateLostFound(1, {
      title: 't',
      description: 'd',
      status: 'found',
      is_completed: false,
    });
    await lfApi.changeCover(1, new File(['x'], 'c.jpg'));
    await lfApi.deleteLostFound(2);
    await lfApi.getStatsDaily({});
    await lfApi.getStatsMonthly({});
    expect(apiFetch.mock.calls.length).toBeGreaterThanOrEqual(8);
  });
});
