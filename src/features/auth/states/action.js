import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from '../api/authApi';
import {
  putAccessToken,
  removeAccessToken,
} from '../../../helpers/apiHelper';
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_IS_AUTH_LOGIN: 'SET_IS_AUTH_LOGIN',
  SET_IS_AUTH_REGISTER: 'SET_IS_AUTH_REGISTER',
  SET_IS_AUTH_LOGOUT: 'SET_IS_AUTH_LOGOUT',
};

export function setIsAuthLogin(isAuthLogin) {
  return {
    type: ActionType.SET_IS_AUTH_LOGIN,
    payload: { isAuthLogin },
  };
}

export function setIsAuthRegister(isAuthRegister) {
  return {
    type: ActionType.SET_IS_AUTH_REGISTER,
    payload: { isAuthRegister },
  };
}

export function setIsAuthLogout(isAuthLogout) {
  return {
    type: ActionType.SET_IS_AUTH_LOGOUT,
    payload: { isAuthLogout },
  };
}

export function asyncSetIsAuthLogin({ email, password }) {
  return async (dispatch) => {
    dispatch(setIsAuthLogin(true));
    try {
      const data = await loginApi({ email, password });
      putAccessToken(data.data.token);
      await showSuccessDialog('Berhasil login');
      return data;
    } catch (error) {
      await showErrorDialog('Gagal login', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthLogin(false));
    }
  };
}

export function asyncSetIsAuthRegister({ name, email, password }) {
  return async (dispatch) => {
    dispatch(setIsAuthRegister(true));
    try {
      const data = await registerApi({ name, email, password });
      await showSuccessDialog(
        'Berhasil registrasi',
        'Silakan login dengan akun baru Anda'
      );
      return data;
    } catch (error) {
      await showErrorDialog('Gagal registrasi', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthRegister(false));
    }
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch) => {
    dispatch(setIsAuthLogout(true));
    try {
      await logoutApi();
    } catch {
      // abaikan error logout API
    } finally {
      removeAccessToken();
      dispatch(setIsAuthLogout(false));
    }
  };
}