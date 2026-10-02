import { describe, it, expect } from 'vitest';
import authReducer from './reducer';
import { ActionType } from './action';

describe('authReducer', () => {
  const initial = {
    isAuthLogin: false,
    isAuthRegister: false,
    isAuthLogout: false,
  };

  it('mengembalikan state awal', () => {
    expect(authReducer(undefined, { type: 'UNKNOWN' })).toEqual(initial);
  });

  it('SET_IS_AUTH_LOGIN', () => {
    const state = authReducer(initial, {
      type: ActionType.SET_IS_AUTH_LOGIN,
      payload: { isAuthLogin: true },
    });
    expect(state.isAuthLogin).toBe(true);
  });

  it('SET_IS_AUTH_REGISTER', () => {
    const state = authReducer(initial, {
      type: ActionType.SET_IS_AUTH_REGISTER,
      payload: { isAuthRegister: true },
    });
    expect(state.isAuthRegister).toBe(true);
  });

  it('SET_IS_AUTH_LOGOUT', () => {
    const state = authReducer(initial, {
      type: ActionType.SET_IS_AUTH_LOGOUT,
      payload: { isAuthLogout: true },
    });
    expect(state.isAuthLogout).toBe(true);
  });
});