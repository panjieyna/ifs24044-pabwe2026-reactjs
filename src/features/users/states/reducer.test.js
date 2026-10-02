import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { ActionType } from './action';

describe('usersReducer', () => {
  const initial = {
    users: [],
    user: null,
    profile: null,
    isProfile: false,
    isChangeProfile: false,
    isChangeProfilePhoto: false,
    isChangeProfilePassword: false,
  };

  it('SET_USERS', () => {
    const users = [{ id: 1, name: 'Test' }];
    const state = usersReducer(initial, {
      type: ActionType.SET_USERS,
      payload: { users },
    });
    expect(state.users).toEqual(users);
  });

  it('SET_PROFILE', () => {
    const profile = { id: 1, name: 'User' };
    const state = usersReducer(initial, {
      type: ActionType.SET_PROFILE,
      payload: { profile },
    });
    expect(state.profile).toEqual(profile);
  });

  it('SET_IS_PROFILE', () => {
    const state = usersReducer(initial, {
      type: ActionType.SET_IS_PROFILE,
      payload: { isProfile: true },
    });
    expect(state.isProfile).toBe(true);
  });
});