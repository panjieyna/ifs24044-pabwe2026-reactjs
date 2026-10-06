import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import AuthLayout from '../features/auth/layouts/AuthLayout';
import LostFoundLayout from '../features/lost-founds/layouts/LostFoundLayout';
import App from '../App';
import { asyncGetProfile } from '../features/users/states/action';

vi.mock('../features/auth/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetIsAuthLogin: vi.fn(() => async () => {}),
    asyncSetIsAuthRegister: vi.fn(() => async () => {}),
    asyncSetIsAuthLogout: vi.fn(() => async () => {}),
  };
});

vi.mock('../features/users/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncGetProfile: vi.fn(() => async () => ({})),
    asyncGetUsers: vi.fn(() => async () => {}),
    asyncChangeProfile: vi.fn(() => async () => {}),
    asyncChangeProfilePhoto: vi.fn(() => async () => {}),
    asyncChangeProfilePassword: vi.fn(() => async () => {}),
  };
});

vi.mock('../features/lost-founds/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncGetLostFounds: vi.fn(() => async () => {}),
    asyncGetLostFoundById: vi.fn(() => async () => {}),
    asyncAddLostFound: vi.fn(() => async () => {}),
    asyncChangeLostFound: vi.fn(() => async () => {}),
    asyncChangeLostFoundCover: vi.fn(() => async () => {}),
    asyncDeleteLostFound: vi.fn(() => async () => {}),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('AuthLayout', () => {
  function renderAuthLayout() {
    return renderWithProviders(
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<div>Isi Halaman Auth</div>} />
        </Route>
        <Route path="/" element={<div>Beranda</div>} />
      </Routes>,
      { route: '/auth/login' }
    );
  }

  it('menampilkan informasi aplikasi dan konten anak saat belum login', () => {
    renderAuthLayout();

    expect(
      screen.getByRole('heading', { name: /lost & found/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Isi Halaman Auth')).toBeInTheDocument();
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
  });

  it('mengalihkan ke beranda saat token sudah ada', async () => {
    localStorage.setItem('accessToken', 'token-rahasia');
    renderAuthLayout();

    expect(await screen.findByText('Beranda')).toBeInTheDocument();
  });
});

describe('LostFoundLayout', () => {
  function renderLayout() {
    return renderWithProviders(
      <Routes>
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<div>Isi Halaman</div>} />
        </Route>
        <Route path="/auth/login" element={<div>Halaman Login</div>} />
      </Routes>,
      { route: '/' }
    );
  }

  it('mengalihkan ke halaman login bila tidak ada token', async () => {
    renderLayout();

    expect(await screen.findByText('Halaman Login')).toBeInTheDocument();
    expect(asyncGetProfile).not.toHaveBeenCalled();
  });

  it('memuat profil dan menampilkan konten bila sudah login', async () => {
    localStorage.setItem('accessToken', 'token-rahasia');
    renderLayout();

    expect(screen.getByText('Isi Halaman')).toBeInTheDocument();
    await waitFor(() => expect(asyncGetProfile).toHaveBeenCalledTimes(1));
  });

  it('membuka dan menutup sidebar', () => {
    localStorage.setItem('accessToken', 'token-rahasia');
    renderLayout();

    const sidebar = screen.getByLabelText('Sidebar navigasi');
    expect(sidebar).not.toHaveClass('translate-x-0');

    fireEvent.click(screen.getByLabelText('Buka menu navigasi'));
    expect(sidebar).toHaveClass('translate-x-0');

    fireEvent.click(screen.getByLabelText('Tutup menu navigasi'));
    expect(sidebar).not.toHaveClass('translate-x-0');
  });

  it('mengalihkan ke login saat profil ditolak dengan status 401', async () => {
    localStorage.setItem('accessToken', 'token-kadaluarsa');
    asyncGetProfile.mockImplementationOnce(() => async () => {
      throw Object.assign(new Error('Unauthorized'), { httpStatus: 401 });
    });
    renderLayout();

    expect(await screen.findByText('Halaman Login')).toBeInTheDocument();
  });

  it('tetap menampilkan layout saat error selain 401', async () => {
    localStorage.setItem('accessToken', 'token-rahasia');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    asyncGetProfile.mockImplementationOnce(() => async () => {
      throw new Error('Server error');
    });
    renderLayout();

    await waitFor(() =>
      expect(errorSpy).toHaveBeenCalledWith(
        'Gagal memuat profil:',
        expect.any(Error)
      )
    );
    expect(screen.getByText('Isi Halaman')).toBeInTheDocument();
    expect(screen.queryByText('Halaman Login')).not.toBeInTheDocument();
    errorSpy.mockRestore();
  });
});

describe('App routing', () => {
  const waitOptions = { timeout: 10000 };

  it(
    'mengarahkan /auth ke halaman login',
    async () => {
      renderWithProviders(<App />, { route: '/auth' });

      expect(
        await screen.findByRole('heading', { name: 'Masuk' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'menampilkan halaman daftar pada /auth/register',
    async () => {
      renderWithProviders(<App />, { route: '/auth/register' });

      expect(
        await screen.findByRole('heading', { name: 'Daftar' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'mengalihkan rute tak dikenal ke login saat belum masuk',
    async () => {
      renderWithProviders(<App />, { route: '/halaman-tidak-ada' });

      expect(
        await screen.findByRole('heading', { name: 'Masuk' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'menampilkan dashboard pada / saat sudah masuk',
    async () => {
      localStorage.setItem('accessToken', 'token-rahasia');
      renderWithProviders(<App />, { route: '/' });

      expect(
        await screen.findByRole('heading', { name: 'Dashboard' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'menampilkan halaman pengguna pada /users',
    async () => {
      localStorage.setItem('accessToken', 'token-rahasia');
      renderWithProviders(<App />, { route: '/users' });

      expect(
        await screen.findByRole('heading', { name: 'Pengguna' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'menampilkan halaman profil pada /profile',
    async () => {
      localStorage.setItem('accessToken', 'token-rahasia');
      renderWithProviders(<App />, { route: '/profile' });

      expect(
        await screen.findByRole('heading', { name: 'Profil Saya' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );

  it(
    'menampilkan halaman detail pada /lost-founds/:id',
    async () => {
      localStorage.setItem('accessToken', 'token-rahasia');
      renderWithProviders(<App />, {
        route: '/lost-founds/1',
        preloadedState: {
          lostFounds: {
            lostFound: {
              id: 1,
              user_id: 1,
              title: 'Judul Detail',
              description: 'Deskripsi detail',
              status: 'lost',
              is_completed: 0,
              cover: null,
              author: { name: 'Dewi' },
            },
            isLostFound: false,
            isLostFoundDelete: false,
          },
          users: { profile: null },
        },
      });

      expect(
        await screen.findByRole('heading', { name: 'Judul Detail' }, waitOptions)
      ).toBeInTheDocument();
    },
    20000
  );
});