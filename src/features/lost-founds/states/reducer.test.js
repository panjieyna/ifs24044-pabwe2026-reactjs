import { describe, it, expect } from 'vitest';
import lostFoundsReducer from './reducer';
import { ActionType } from './action';

describe('lostFoundsReducer', () => {
  const initial = {
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

  it('SET_LOST_FOUNDS', () => {
    const list = [{ id: 1, title: 'Kunci' }];
    const state = lostFoundsReducer(initial, {
      type: ActionType.SET_LOST_FOUNDS,
      payload: { lostFounds: list },
    });
    expect(state.lostFounds).toEqual(list);
  });

  it('SET_LOST_FOUND', () => {
    const item = { id: 1, title: 'Dompet' };
    const state = lostFoundsReducer(initial, {
      type: ActionType.SET_LOST_FOUND,
      payload: { lostFound: item },
    });
    expect(state.lostFound).toEqual(item);
  });

  it('SET_IS_LOST_FOUND_ADD', () => {
    const state = lostFoundsReducer(initial, {
      type: ActionType.SET_IS_LOST_FOUND_ADD,
      payload: { isLostFoundAdd: true },
    });
    expect(state.isLostFoundAdd).toBe(true);
  });
});