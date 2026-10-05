import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  setUsers,
  setUser,
  setProfile,
  setIsProfile,
  setIsChangeProfile,
  setIsChangeProfilePhoto,
  setIsChangeProfilePassword,
  asyncGetUsers,
  asyncGetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from '../features/users/states/action';
import * as userApi from '../features/users/api/userApi';
import * as tools from '../helpers/toolsHelper';

vi.mock('../features/users/api/userApi');
vi.mock('../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(() => Promise.resolve()),
  showErrorDialog: vi.fn(() => Promise.resolve()),
}));

describe('users actions', () => {
  const dispatch = vi.fn((a) => a);

  beforeEach(() => vi.clearAllMocks());

  it('sync creators', () => {
    expect(setUsers([]).type).toBe(ActionType.SET_USERS);
    expect(setUser({}).type).toBe(ActionType.SET_USER);
    expect(setProfile({}).type).toBe(ActionType.SET_PROFILE);
    expect(setIsProfile(true).type).toBe(ActionType.SET_IS_PROFILE);
    expect(setIsChangeProfile(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE
    );
    expect(setIsChangeProfilePhoto(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE_PHOTO
    );
    expect(setIsChangeProfilePassword(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE_PASSWORD
    );
  });

  it('asyncGetUsers success and fail', async () => {
    userApi.getUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    await asyncGetUsers()(dispatch);
    expect(dispatch).toHaveBeenCalled();

    userApi.getUsers.mockRejectedValue(new Error('e'));
    await asyncGetUsers()(dispatch);
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncGetProfile success and fail', async () => {
    userApi.getProfile.mockResolvedValue({
      data: { user: { id: 1, name: 'A' } },
    });
    const u = await asyncGetProfile()(dispatch);
    expect(u.name).toBe('A');

    userApi.getProfile.mockRejectedValue(new Error('e'));
    await expect(asyncGetProfile()(dispatch)).rejects.toThrow();
  });

  it('asyncChangeProfile success and fail', async () => {
    userApi.updateProfile.mockResolvedValue({
      data: { user: { name: 'B' } },
    });
    await asyncChangeProfile({ name: 'B', email: 'b@c.d' })(dispatch);
    expect(tools.showSuccessDialog).toHaveBeenCalled();

    userApi.updateProfile.mockRejectedValue(new Error('e'));
    await expect(
      asyncChangeProfile({ name: 'B', email: 'b@c.d' })(dispatch)
    ).rejects.toThrow();
  });

  it('asyncChangeProfilePhoto success and fail', async () => {
    userApi.changePhoto.mockResolvedValue({});
    userApi.getProfile.mockResolvedValue({ data: { user: { id: 1 } } });
    await asyncChangeProfilePhoto(new File(['x'], 'a.jpg'))(dispatch);
    expect(tools.showSuccessDialog).toHaveBeenCalled();

    userApi.changePhoto.mockRejectedValue(new Error('e'));
    await expect(
      asyncChangeProfilePhoto(new File(['x'], 'a.jpg'))(dispatch)
    ).rejects.toThrow();
  });

  it('asyncChangeProfilePassword success and fail', async () => {
    userApi.changePassword.mockResolvedValue({});
    await asyncChangeProfilePassword({
      password: 'a',
      new_password: 'b',
      new_password_confirmation: 'b',
    })(dispatch);
    expect(tools.showSuccessDialog).toHaveBeenCalled();

    userApi.changePassword.mockRejectedValue(new Error('e'));
    await expect(
      asyncChangeProfilePassword({
        password: 'a',
        new_password: 'b',
        new_password_confirmation: 'b',
      })(dispatch)
    ).rejects.toThrow();
  });
});
