import { describe, it, expect } from 'vitest';
import authReducer from '../features/auth/states/reducer';
import { ActionType as AuthAT } from '../features/auth/states/action';
import usersReducer from '../features/users/states/reducer';
import { ActionType as UsersAT } from '../features/users/states/action';
import lostFoundsReducer from '../features/lost-founds/states/reducer';
import { ActionType as LfAT } from '../features/lost-founds/states/action';

describe('authReducer full', () => {
  it('default and all cases', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toBeTruthy();
    expect(
      authReducer(undefined, {
        type: AuthAT.SET_IS_AUTH_LOGIN,
        payload: { isAuthLogin: true },
      }).isAuthLogin
    ).toBe(true);
    expect(
      authReducer(undefined, {
        type: AuthAT.SET_IS_AUTH_REGISTER,
        payload: { isAuthRegister: true },
      }).isAuthRegister
    ).toBe(true);
    expect(
      authReducer(undefined, {
        type: AuthAT.SET_IS_AUTH_LOGOUT,
        payload: { isAuthLogout: true },
      }).isAuthLogout
    ).toBe(true);
  });
});

describe('usersReducer full', () => {
  it('all cases', () => {
    const s0 = usersReducer(undefined, { type: '@@INIT' });
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_USERS,
        payload: { users: [1] },
      }).users
    ).toEqual([1]);
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_PROFILE,
        payload: { profile: { id: 1 } },
      }).profile
    ).toEqual({ id: 1 });
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_IS_PROFILE,
        payload: { isProfile: true },
      }).isProfile
    ).toBe(true);
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_IS_CHANGE_PROFILE,
        payload: { isChangeProfile: true },
      }).isChangeProfile
    ).toBe(true);
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_IS_CHANGE_PROFILE_PHOTO,
        payload: { isChangeProfilePhoto: true },
      }).isChangeProfilePhoto
    ).toBe(true);
    expect(
      usersReducer(s0, {
        type: UsersAT.SET_IS_CHANGE_PROFILE_PASSWORD,
        payload: { isChangeProfilePassword: true },
      }).isChangeProfilePassword
    ).toBe(true);
  });
});

describe('lostFoundsReducer full', () => {
  it('all cases', () => {
    const s0 = lostFoundsReducer(undefined, { type: '@@INIT' });
    const cases = [
      [LfAT.SET_LOST_FOUNDS, { lostFounds: [1] }, 'lostFounds', [1]],
      [LfAT.SET_LOST_FOUND, { lostFound: { id: 1 } }, 'lostFound', { id: 1 }],
      [LfAT.SET_IS_LOST_FOUND, { isLostFound: true }, 'isLostFound', true],
      [LfAT.SET_IS_LOST_FOUND_ADD, { isLostFoundAdd: true }, 'isLostFoundAdd', true],
      [
        LfAT.SET_IS_LOST_FOUND_ADDED,
        { isLostFoundAdded: true },
        'isLostFoundAdded',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_CHANGE,
        { isLostFoundChange: true },
        'isLostFoundChange',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_CHANGED,
        { isLostFoundChanged: true },
        'isLostFoundChanged',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_CHANGE_COVER,
        { isLostFoundChangeCover: true },
        'isLostFoundChangeCover',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_CHANGED_COVER,
        { isLostFoundChangedCover: true },
        'isLostFoundChangedCover',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_DELETE,
        { isLostFoundDelete: true },
        'isLostFoundDelete',
        true,
      ],
      [
        LfAT.SET_IS_LOST_FOUND_DELETED,
        { isLostFoundDeleted: true },
        'isLostFoundDeleted',
        true,
      ],
      [
        LfAT.SET_LOST_FOUND_STATS,
        { lostFoundStats: { a: 1 } },
        'lostFoundStats',
        { a: 1 },
      ],
    ];
    for (const [type, payload, key, val] of cases) {
      expect(lostFoundsReducer(s0, { type, payload })[key]).toEqual(val);
    }
  });
});
