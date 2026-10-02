import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from './apiHelper';

describe('apiHelper token utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('menyimpan dan mengambil token', () => {
    putAccessToken('token123');
    expect(getAccessToken()).toBe('token123');
  });

  it('menghapus token dengan removeAccessToken', () => {
    putAccessToken('token123');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it('putAccessToken(null) menghapus token', () => {
    putAccessToken('token123');
    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});