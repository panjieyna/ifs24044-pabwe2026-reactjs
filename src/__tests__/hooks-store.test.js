import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useInput from '../hooks/useInput';
import { createTestStore } from '../test-utils';

describe('useInput', () => {
  it('default and change', () => {
    const { result } = renderHook(() => useInput('hi'));
    expect(result.current[0]).toBe('hi');
    act(() => {
      result.current[1]({ target: { value: 'bye' } });
    });
    expect(result.current[0]).toBe('bye');
    act(() => {
      result.current[2]('set');
    });
    expect(result.current[0]).toBe('set');
  });
});

describe('store', () => {
  it('createTestStore has reducers', () => {
    const store = createTestStore();
    const s = store.getState();
    expect(s).toHaveProperty('auth');
    expect(s).toHaveProperty('users');
    expect(s).toHaveProperty('lostFounds');
  });
});
