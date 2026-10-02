import {
  getLostFounds as getLostFoundsApi,
  getLostFoundById as getLostFoundByIdApi,
  addLostFound as addLostFoundApi,
  updateLostFound as updateLostFoundApi,
  changeCover as changeCoverApi,
  deleteLostFound as deleteLostFoundApi,
  getStatsDaily as getStatsDailyApi,
  getStatsMonthly as getStatsMonthlyApi,
} from '../api/LostFoundApi';
import {
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper';

export const ActionType = {
  SET_LOST_FOUNDS: 'SET_LOST_FOUNDS',
  SET_LOST_FOUND: 'SET_LOST_FOUND',
  SET_IS_LOST_FOUND: 'SET_IS_LOST_FOUND',
  SET_IS_LOST_FOUND_ADD: 'SET_IS_LOST_FOUND_ADD',
  SET_IS_LOST_FOUND_ADDED: 'SET_IS_LOST_FOUND_ADDED',
  SET_IS_LOST_FOUND_CHANGE: 'SET_IS_LOST_FOUND_CHANGE',
  SET_IS_LOST_FOUND_CHANGED: 'SET_IS_LOST_FOUND_CHANGED',
  SET_IS_LOST_FOUND_CHANGE_COVER: 'SET_IS_LOST_FOUND_CHANGE_COVER',
  SET_IS_LOST_FOUND_CHANGED_COVER: 'SET_IS_LOST_FOUND_CHANGED_COVER',
  SET_IS_LOST_FOUND_DELETE: 'SET_IS_LOST_FOUND_DELETE',
  SET_IS_LOST_FOUND_DELETED: 'SET_IS_LOST_FOUND_DELETED',
  SET_LOST_FOUND_STATS: 'SET_LOST_FOUND_STATS',
};

export function setLostFounds(lostFounds) {
  return { type: ActionType.SET_LOST_FOUNDS, payload: { lostFounds } };
}
export function setLostFound(lostFound) {
  return { type: ActionType.SET_LOST_FOUND, payload: { lostFound } };
}
export function setIsLostFound(isLostFound) {
  return { type: ActionType.SET_IS_LOST_FOUND, payload: { isLostFound } };
}
export function setIsLostFoundAdd(isLostFoundAdd) {
  return { type: ActionType.SET_IS_LOST_FOUND_ADD, payload: { isLostFoundAdd } };
}
export function setIsLostFoundAdded(isLostFoundAdded) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADDED,
    payload: { isLostFoundAdded },
  };
}
export function setIsLostFoundChange(isLostFoundChange) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE,
    payload: { isLostFoundChange },
  };
}
export function setIsLostFoundChanged(isLostFoundChanged) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED,
    payload: { isLostFoundChanged },
  };
}
export function setIsLostFoundChangeCover(isLostFoundChangeCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    payload: { isLostFoundChangeCover },
  };
}
export function setIsLostFoundChangedCover(isLostFoundChangedCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    payload: { isLostFoundChangedCover },
  };
}
export function setIsLostFoundDelete(isLostFoundDelete) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETE,
    payload: { isLostFoundDelete },
  };
}
export function setIsLostFoundDeleted(isLostFoundDeleted) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETED,
    payload: { isLostFoundDeleted },
  };
}
export function setLostFoundStats(lostFoundStats) {
  return {
    type: ActionType.SET_LOST_FOUND_STATS,
    payload: { lostFoundStats },
  };
}

export function asyncGetLostFounds(params = {}) {
  return async (dispatch) => {
    try {
      const data = await getLostFoundsApi(params);
      dispatch(setLostFounds(data.data.lost_founds || []));
    } catch (error) {
      await showErrorDialog('Gagal mengambil data', error.message);
    }
  };
}

export function asyncGetLostFoundById(id) {
  return async (dispatch) => {
    dispatch(setIsLostFound(true));
    try {
      const data = await getLostFoundByIdApi(id);
      dispatch(setLostFound(data.data.lost_found));
      return data.data.lost_found;
    } catch (error) {
      dispatch(setLostFound(null));
      await showErrorDialog('Gagal mengambil detail', error.message);
      throw error;
    } finally {
      dispatch(setIsLostFound(false));
    }
  };
}

export function asyncAddLostFound(payload) {
  return async (dispatch) => {
    dispatch(setIsLostFoundAdd(true));
    dispatch(setIsLostFoundAdded(false));
    try {
      await addLostFoundApi(payload);
      dispatch(setIsLostFoundAdded(true));
      await showSuccessDialog('Laporan berhasil ditambahkan');
    } catch (error) {
      await showErrorDialog('Gagal menambah laporan', error.message);
      throw error;
    } finally {
      dispatch(setIsLostFoundAdd(false));
    }
  };
}

export function asyncChangeLostFound(id, payload) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChange(true));
    dispatch(setIsLostFoundChanged(false));
    try {
      await updateLostFoundApi(id, payload);
      dispatch(setIsLostFoundChanged(true));
      await showSuccessDialog('Laporan berhasil diubah');
    } catch (error) {
      await showErrorDialog('Gagal mengubah laporan', error.message);
      throw error;
    } finally {
      dispatch(setIsLostFoundChange(false));
    }
  };
}

export function asyncChangeLostFoundCover(id, file) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeCover(true));
    dispatch(setIsLostFoundChangedCover(false));
    try {
      await changeCoverApi(id, file);
      dispatch(setIsLostFoundChangedCover(true));
      await showSuccessDialog('Cover berhasil diubah');
    } catch (error) {
      await showErrorDialog('Gagal mengubah cover', error.message);
      throw error;
    } finally {
      dispatch(setIsLostFoundChangeCover(false));
    }
  };
}

export function asyncDeleteLostFound(id) {
  return async (dispatch) => {
    dispatch(setIsLostFoundDelete(true));
    dispatch(setIsLostFoundDeleted(false));
    try {
      await deleteLostFoundApi(id);
      dispatch(setIsLostFoundDeleted(true));
      await showSuccessDialog('Laporan berhasil dihapus');
    } catch (error) {
      await showErrorDialog('Gagal menghapus laporan', error.message);
      throw error;
    } finally {
      dispatch(setIsLostFoundDelete(false));
    }
  };
}

export function asyncGetLostFoundStats() {
  return async (dispatch) => {
    try {
      const [daily, monthly] = await Promise.all([
        getStatsDailyApi(),
        getStatsMonthlyApi(),
      ]);
      dispatch(
        setLostFoundStats({ daily: daily.data, monthly: monthly.data })
      );
    } catch (error) {
      console.error(error);
    }
  };
}