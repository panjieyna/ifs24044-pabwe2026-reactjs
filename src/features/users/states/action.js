import {
  getUsers as getUsersApi,
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
  changePhoto as changePhotoApi,
  changePassword as changePasswordApi,
} from '../api/userApi';
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_USERS: 'SET_USERS',
  SET_USER: 'SET_USER',
  SET_PROFILE: 'SET_PROFILE',
  SET_IS_PROFILE: 'SET_IS_PROFILE',
  SET_IS_CHANGE_PROFILE: 'SET_IS_CHANGE_PROFILE',
  SET_IS_CHANGE_PROFILE_PHOTO: 'SET_IS_CHANGE_PROFILE_PHOTO',
  SET_IS_CHANGE_PROFILE_PASSWORD: 'SET_IS_CHANGE_PROFILE_PASSWORD',
};

export function setUsers(users) {
  return { type: ActionType.SET_USERS, payload: { users } };
}

export function setUser(user) {
  return { type: ActionType.SET_USER, payload: { user } };
}

export function setProfile(profile) {
  return { type: ActionType.SET_PROFILE, payload: { profile } };
}

export function setIsProfile(isProfile) {
  return { type: ActionType.SET_IS_PROFILE, payload: { isProfile } };
}

export function setIsChangeProfile(isChangeProfile) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: { isChangeProfile },
  };
}

export function setIsChangeProfilePhoto(isChangeProfilePhoto) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: { isChangeProfilePhoto },
  };
}

export function setIsChangeProfilePassword(isChangeProfilePassword) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: { isChangeProfilePassword },
  };
}

export function asyncGetUsers() {
  return async (dispatch) => {
    try {
      const data = await getUsersApi();
      dispatch(setUsers(data.data.users || []));
    } catch (error) {
      await showErrorDialog('Gagal mengambil data pengguna', error.message);
    }
  };
}

export function asyncGetProfile() {
  return async (dispatch) => {
    dispatch(setIsProfile(true));
    try {
      const data = await getProfileApi();
      dispatch(setProfile(data.data.user));
      return data.data.user;
    } catch (error) {
      dispatch(setProfile(null));
      throw error;
    } finally {
      dispatch(setIsProfile(false));
    }
  };
}

export function asyncChangeProfile({ name, email }) {
  return async (dispatch) => {
    dispatch(setIsChangeProfile(true));
    try {
      const data = await updateProfileApi({ name, email });
      dispatch(setProfile(data.data.user));
      await showSuccessDialog('Profil berhasil diperbarui');
      return data;
    } catch (error) {
      await showErrorDialog('Gagal mengubah profil', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfile(false));
    }
  };
}

export function asyncChangeProfilePhoto(file) {
  return async (dispatch) => {
    dispatch(setIsChangeProfilePhoto(true));
    try {
      await changePhotoApi(file);
      const data = await getProfileApi();
      dispatch(setProfile(data.data.user));
      await showSuccessDialog('Foto profil berhasil diubah');
    } catch (error) {
      await showErrorDialog('Gagal mengubah foto', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePhoto(false));
    }
  };
}

export function asyncChangeProfilePassword(payload) {
  return async (dispatch) => {
    dispatch(setIsChangeProfilePassword(true));
    try {
      await changePasswordApi(payload);
      await showSuccessDialog('Kata sandi berhasil diubah');
    } catch (error) {
      await showErrorDialog('Gagal mengubah kata sandi', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePassword(false));
    }
  };
}