import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useInput from './useInput';

describe('useInput', () => {
  it('mengembalikan nilai default', () => {
    const { result } = renderHook(() => useInput('hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('mengubah value saat onChange', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => {
      result.current[1]({ target: { value: 'test' } });
    });
    expect(result.current[0]).toBe('test');
  });

  it('setValue bekerja', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => {
      result.current[2]('manual');
    });
    expect(result.current[0]).toBe('manual');
  });
});