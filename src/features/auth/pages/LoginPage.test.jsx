import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('menampilkan form login', () => {
    renderWithProviders(<LoginPage />, { route: '/auth/login' });

    // judul halaman (h2)
    expect(
      screen.getByRole('heading', { name: 'Masuk' })
    ).toBeInTheDocument();

    // input email
    expect(
      screen.getByPlaceholderText('nama@email.com')
    ).toBeInTheDocument();

    // tombol submit
    expect(
      screen.getByRole('button', { name: /masuk/i })
    ).toBeInTheDocument();
  });

  it('menampilkan link daftar', () => {
    renderWithProviders(<LoginPage />, { route: '/auth/login' });
    expect(screen.getByText('Daftar')).toBeInTheDocument();
  });
});