import { describe, it, expect } from 'vitest';
import store from './store';

describe('store', () => {
  it('memiliki slice auth, users, dan lostFounds', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('lostFounds');
  });
});