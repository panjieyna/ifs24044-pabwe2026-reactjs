import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  setIsAuthLogin,
  setIsAuthRegister,
  setIsAuthLogout,
  asyncSetIsAuthLogin,
  asyncSetIsAuthRegister,
  asyncSetIsAuthLogout,
} from '../features/auth/states/action';
import * as authApi from '../features/auth/api/authApi';
import * as tools from '../helpers/toolsHelper';

vi.mock('../features/auth/api/authApi');
vi.mock('../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(() => Promise.resolve()),
  showErrorDialog: vi.fn(() => Promise.resolve()),
}));

describe('auth actions', () => {
  const dispatch = vi.fn((a) => a);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('sync creators', () => {
    expect(setIsAuthLogin(true).type).toBe(ActionType.SET_IS_AUTH_LOGIN);
    expect(setIsAuthRegister(true).type).toBe(ActionType.SET_IS_AUTH_REGISTER);
    expect(setIsAuthLogout(true).type).toBe(ActionType.SET_IS_AUTH_LOGOUT);
  });

  it('async login success', async () => {
    authApi.login.mockResolvedValue({ data: { token: 't1' } });
    await asyncSetIsAuthLogin({ email: 'a@b.c', password: 'x' })(dispatch);
    expect(localStorage.getItem('accessToken')).toBe('t1');
    expect(tools.showSuccessDialog).toHaveBeenCalled();
  });

  it('async login fail', async () => {
    authApi.login.mockRejectedValue(new Error('bad'));
    await expect(
      asyncSetIsAuthLogin({ email: 'a', password: 'b' })(dispatch)
    ).rejects.toThrow();
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('async register success and fail', async () => {
    authApi.register.mockResolvedValue({ status: 'success' });
    await asyncSetIsAuthRegister({
      name: 'A',
      email: 'a@b.c',
      password: 'x',
    })(dispatch);
    expect(tools.showSuccessDialog).toHaveBeenCalled();

    authApi.register.mockRejectedValue(new Error('fail'));
    await expect(
      asyncSetIsAuthRegister({ name: 'A', email: 'a', password: 'x' })(
        dispatch
      )
    ).rejects.toThrow();
  });

  it('async logout clears token even if api fails', async () => {
    localStorage.setItem('accessToken', 'x');
    authApi.logout.mockRejectedValue(new Error('x'));
    await asyncSetIsAuthLogout()(dispatch);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
