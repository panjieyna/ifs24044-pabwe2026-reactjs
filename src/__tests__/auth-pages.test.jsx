import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import * as authAction from '../features/auth/states/action';

vi.mock('../features/auth/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetIsAuthLogin: vi.fn(() => async () => {}),
    asyncSetIsAuthRegister: vi.fn(() => async () => {}),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

function submitForm(container) {
  fireEvent.submit(container.querySelector('form'));
}

describe('LoginPage interaksi', () => {
  function renderLogin(preloadedState = {}) {
    return renderWithProviders(
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<div>Beranda</div>} />
      </Routes>,
      { route: '/auth/login', preloadedState }
    );
  }

  function fillLogin(email, password) {
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), {
      target: { value: password },
    });
  }

  it('menampilkan error bila email atau kata sandi kosong', () => {
    const { container } = renderLogin();

    submitForm(container);

    expect(
      screen.getByText('Email dan kata sandi wajib diisi')
    ).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthLogin).not.toHaveBeenCalled();
  });

  it('masuk lalu menuju beranda', async () => {
    const { container } = renderLogin();
    fillLogin('panji@mail.com', 'rahasia123');

    submitForm(container);

    expect(await screen.findByText('Beranda')).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthLogin).toHaveBeenCalledWith({
      email: 'panji@mail.com',
      password: 'rahasia123',
    });
  });

  it('tetap di halaman login saat proses masuk gagal', async () => {
    authAction.asyncSetIsAuthLogin.mockImplementationOnce(() => async () => {
      throw new Error('Kredensial salah');
    });
    const { container } = renderLogin();
    fillLogin('panji@mail.com', 'salah');

    submitForm(container);

    await waitFor(() =>
      expect(authAction.asyncSetIsAuthLogin).toHaveBeenCalled()
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('menampilkan status saat proses masuk berjalan', () => {
    renderLogin({ auth: { isAuthLogin: true } });

    expect(screen.getByRole('button', { name: 'Memproses...' })).toBeDisabled();
  });
});

describe('RegisterPage interaksi', () => {
  function renderRegister(preloadedState = {}) {
    return renderWithProviders(
      <Routes>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<div>Halaman Login</div>} />
      </Routes>,
      { route: '/auth/register', preloadedState }
    );
  }

  function fillRegister(name, email, password) {
    fireEvent.change(screen.getByLabelText('Nama'), {
      target: { value: name },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText('Kata Sandi'), {
      target: { value: password },
    });
  }

  it('menampilkan error bila ada field yang kosong', () => {
    const { container } = renderRegister();

    submitForm(container);

    expect(screen.getByText('Semua field wajib diisi')).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthRegister).not.toHaveBeenCalled();
  });

  it('menolak kata sandi yang kurang dari 6 karakter', () => {
    const { container } = renderRegister();
    fillRegister('Panji', 'panji@mail.com', '12345');

    submitForm(container);

    expect(
      screen.getByText('Kata sandi minimal 6 karakter')
    ).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthRegister).not.toHaveBeenCalled();
  });

  it('mendaftar lalu menuju halaman login', async () => {
    const { container } = renderRegister();
    fillRegister('Panji', 'panji@mail.com', 'rahasia123');

    submitForm(container);

    expect(await screen.findByText('Halaman Login')).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthRegister).toHaveBeenCalledWith({
      name: 'Panji',
      email: 'panji@mail.com',
      password: 'rahasia123',
    });
  });

  it('tetap di halaman daftar saat pendaftaran gagal', async () => {
    authAction.asyncSetIsAuthRegister.mockImplementationOnce(
      () => async () => {
        throw new Error('Email sudah dipakai');
      }
    );
    const { container } = renderRegister();
    fillRegister('Panji', 'panji@mail.com', 'rahasia123');

    submitForm(container);

    await waitFor(() =>
      expect(authAction.asyncSetIsAuthRegister).toHaveBeenCalled()
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('Halaman Login')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Daftar' })).toBeInTheDocument();
  });

  it('menampilkan status saat pendaftaran berjalan', () => {
    renderRegister({ auth: { isAuthRegister: true } });

    expect(screen.getByRole('button', { name: 'Memproses...' })).toBeDisabled();
  });
});