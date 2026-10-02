import { ActionType } from './action';

const initialState = {
  lostFounds: [],
  lostFound: null,
  isLostFound: false,
  isLostFoundAdd: false,
  isLostFoundAdded: false,
  isLostFoundChange: false,
  isLostFoundChanged: false,
  isLostFoundChangeCover: false,
  isLostFoundChangedCover: false,
  isLostFoundDelete: false,
  isLostFoundDeleted: false,
  lostFoundStats: null,
};

export default function lostFoundsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUNDS:
      return { ...state, lostFounds: action.payload.lostFounds };
    case ActionType.SET_LOST_FOUND:
      return { ...state, lostFound: action.payload.lostFound };
    case ActionType.SET_IS_LOST_FOUND:
      return { ...state, isLostFound: action.payload.isLostFound };
    case ActionType.SET_IS_LOST_FOUND_ADD:
      return { ...state, isLostFoundAdd: action.payload.isLostFoundAdd };
    case ActionType.SET_IS_LOST_FOUND_ADDED:
      return { ...state, isLostFoundAdded: action.payload.isLostFoundAdded };
    case ActionType.SET_IS_LOST_FOUND_CHANGE:
      return { ...state, isLostFoundChange: action.payload.isLostFoundChange };
    case ActionType.SET_IS_LOST_FOUND_CHANGED:
      return {
        ...state,
        isLostFoundChanged: action.payload.isLostFoundChanged,
      };
    case ActionType.SET_IS_LOST_FOUND_CHANGE_COVER:
      return {
        ...state,
        isLostFoundChangeCover: action.payload.isLostFoundChangeCover,
      };
    case ActionType.SET_IS_LOST_FOUND_CHANGED_COVER:
      return {
        ...state,
        isLostFoundChangedCover: action.payload.isLostFoundChangedCover,
      };
    case ActionType.SET_IS_LOST_FOUND_DELETE:
      return { ...state, isLostFoundDelete: action.payload.isLostFoundDelete };
    case ActionType.SET_IS_LOST_FOUND_DELETED:
      return {
        ...state,
        isLostFoundDeleted: action.payload.isLostFoundDeleted,
      };
    case ActionType.SET_LOST_FOUND_STATS:
      return { ...state, lostFoundStats: action.payload.lostFoundStats };
    default:
      return state;
  }
}