import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as actions from '../features/lost-founds/states/action';
import * as lfApi from '../features/lost-founds/api/LostFoundApi';
import * as tools from '../helpers/toolsHelper';

vi.mock('../features/lost-founds/api/LostFoundApi');
vi.mock('../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(() => Promise.resolve()),
  showErrorDialog: vi.fn(() => Promise.resolve()),
}));

describe('lost-founds actions', () => {
  const dispatch = vi.fn((a) => a);

  beforeEach(() => vi.clearAllMocks());

  it('sync creators', () => {
    expect(actions.setLostFounds([]).type).toBe(
      actions.ActionType.SET_LOST_FOUNDS
    );
    expect(actions.setLostFound(null).type).toBe(
      actions.ActionType.SET_LOST_FOUND
    );
    expect(actions.setIsLostFound(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND
    );
    expect(actions.setIsLostFoundAdd(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_ADD
    );
    expect(actions.setIsLostFoundAdded(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_ADDED
    );
    expect(actions.setIsLostFoundChange(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_CHANGE
    );
    expect(actions.setIsLostFoundChanged(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_CHANGED
    );
    expect(actions.setIsLostFoundChangeCover(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_CHANGE_COVER
    );
    expect(actions.setIsLostFoundChangedCover(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_CHANGED_COVER
    );
    expect(actions.setIsLostFoundDelete(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_DELETE
    );
    expect(actions.setIsLostFoundDeleted(true).type).toBe(
      actions.ActionType.SET_IS_LOST_FOUND_DELETED
    );
    expect(actions.setLostFoundStats({}).type).toBe(
      actions.ActionType.SET_LOST_FOUND_STATS
    );
  });

  it('asyncGetLostFounds', async () => {
    lfApi.getLostFounds.mockResolvedValue({
      data: { lost_founds: [{ id: 1 }] },
    });
    await actions.asyncGetLostFounds({})(dispatch);
    lfApi.getLostFounds.mockRejectedValue(new Error('e'));
    await actions.asyncGetLostFounds({})(dispatch);
    expect(tools.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncGetLostFoundById', async () => {
    lfApi.getLostFoundById.mockResolvedValue({
      data: { lost_found: { id: 1 } },
    });
    await actions.asyncGetLostFoundById(1)(dispatch);
    lfApi.getLostFoundById.mockRejectedValue(new Error('e'));
    await expect(actions.asyncGetLostFoundById(1)(dispatch)).rejects.toThrow();
  });

  it('asyncAddLostFound', async () => {
    lfApi.addLostFound.mockResolvedValue({});
    await actions.asyncAddLostFound({
      title: 't',
      description: 'd',
      status: 'lost',
    })(dispatch);
    expect(tools.showSuccessDialog).toHaveBeenCalled();
    lfApi.addLostFound.mockRejectedValue(new Error('e'));
    await expect(
      actions.asyncAddLostFound({
        title: 't',
        description: 'd',
        status: 'lost',
      })(dispatch)
    ).rejects.toThrow();
  });

  it('asyncChangeLostFound', async () => {
    lfApi.updateLostFound.mockResolvedValue({});
    await actions.asyncChangeLostFound(1, {
      title: 't',
      description: 'd',
      status: 'lost',
      is_completed: false,
    })(dispatch);
    lfApi.updateLostFound.mockRejectedValue(new Error('e'));
    await expect(
      actions.asyncChangeLostFound(1, {
        title: 't',
        description: 'd',
        status: 'lost',
        is_completed: false,
      })(dispatch)
    ).rejects.toThrow();
  });

  it('asyncChangeLostFoundCover', async () => {
    lfApi.changeCover.mockResolvedValue({});
    await actions.asyncChangeLostFoundCover(1, new File(['x'], 'a.jpg'))(
      dispatch
    );
    lfApi.changeCover.mockRejectedValue(new Error('e'));
    await expect(
      actions.asyncChangeLostFoundCover(1, new File(['x'], 'a.jpg'))(dispatch)
    ).rejects.toThrow();
  });

  it('asyncDeleteLostFound', async () => {
    lfApi.deleteLostFound.mockResolvedValue({});
    await actions.asyncDeleteLostFound(1)(dispatch);
    lfApi.deleteLostFound.mockRejectedValue(new Error('e'));
    await expect(actions.asyncDeleteLostFound(1)(dispatch)).rejects.toThrow();
  });

  it('asyncGetLostFoundStats', async () => {
    lfApi.getStatsDaily.mockResolvedValue({ data: { a: 1 } });
    lfApi.getStatsMonthly.mockResolvedValue({ data: { b: 2 } });
    await actions.asyncGetLostFoundStats()(dispatch);
    lfApi.getStatsDaily.mockRejectedValue(new Error('e'));
    await actions.asyncGetLostFoundStats()(dispatch);
  });
});
