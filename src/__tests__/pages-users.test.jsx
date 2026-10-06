import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import UsersPage from '../features/users/pages/UsersPage';
import ProfilePage from '../features/users/pages/ProfilePage';
import * as userAction from '../features/users/states/action';

vi.mock('../features/users/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncGetUsers: vi.fn(() => async () => {}),
    asyncChangeProfile: vi.fn(() => async () => {}),
    asyncChangeProfilePhoto: vi.fn(() => async () => {}),
    asyncChangeProfilePassword: vi.fn(() => async () => {}),
  };
});

const users = [
  {
    id: 1,
    name: 'Ani Wijaya',
    email: 'ani@mail.com',
    photo: 'photos/ani.png',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 2,
    name: 'Budi',
    email: 'budi@mail.com',
    photo: null,
    created_at: null,
  },
  {
    id: 3,
    email: 'tanpa-nama@mail.com',
  },
];

function renderUsers(list = users) {
  return renderWithProviders(<UsersPage />, {
    preloadedState: { users: { users: list } },
  });
}

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('memuat dan menampilkan daftar pengguna', () => {
    const { container } = renderUsers();

    expect(userAction.asyncGetUsers).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ani Wijaya')).toBeInTheDocument();
    expect(screen.getByText('budi@mail.com')).toBeInTheDocument();
    expect(screen.getByText('tanpa-nama@mail.com')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://open-api.delcom.org/photos/ani.png'
    );
  });

  it('menampilkan keadaan kosong', () => {
    renderUsers([]);
    expect(screen.getByText('Tidak ada pengguna')).toBeInTheDocument();
  });

  it('memfilter pengguna berdasarkan nama atau email', () => {
    renderUsers();
    const input = screen.getByPlaceholderText('Cari nama atau email...');

    fireEvent.change(input, { target: { value: 'ani' } });
    expect(screen.getByText('Ani Wijaya')).toBeInTheDocument();
    expect(screen.queryByText('Budi')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'budi@mail' } });
    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(screen.queryByText('Ani Wijaya')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'tanpa' } });
    expect(screen.getByText('tanpa-nama@mail.com')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'tidak-ketemu' } });
    expect(screen.getByText('Tidak ada pengguna')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(screen.getByText('Ani Wijaya')).toBeInTheDocument();
    expect(screen.getByText('Budi')).toBeInTheDocument();
  });
});

const profile = {
  id: 1,
  name: 'Panji',
  email: 'panji@mail.com',
  photo: null,
};

function renderProfile(usersState = {}) {
  return renderWithProviders(<ProfilePage />, {
    preloadedState: {
      users: {
        profile,
        isChangeProfile: false,
        isChangeProfilePhoto: false,
        isChangeProfilePassword: false,
        ...usersState,
      },
    },
  });
}

function submitFormOf(element) {
  fireEvent.submit(element.closest('form'));
}

function fillPasswordForm(oldPass, newPass, confirmPass) {
  fireEvent.change(screen.getByLabelText('Kata Sandi Lama'), {
    target: { value: oldPass },
  });
  fireEvent.change(screen.getByLabelText('Kata Sandi Baru'), {
    target: { value: newPass },
  });
  fireEvent.change(screen.getByLabelText('Konfirmasi Kata Sandi Baru'), {
    target: { value: confirmPass },
  });
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mengisi form dengan data profil', async () => {
    renderProfile();

    await waitFor(() =>
      expect(screen.getByLabelText('Nama')).toHaveValue('Panji')
    );
    expect(screen.getByLabelText('Email')).toHaveValue('panji@mail.com');
    expect(screen.getByText('Profil Saya')).toBeInTheDocument();
  });

  it('menampilkan foto profil bila tersedia', () => {
    const { container } = renderProfile({
      profile: { ...profile, photo: 'photos/panji.png' },
    });
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://open-api.delcom.org/photos/panji.png'
    );
  });

  it('tetap tampil saat profil belum ada atau tidak lengkap', async () => {
    const { unmount } = renderProfile({ profile: null });
    expect(screen.getByLabelText('Nama')).toHaveValue('');
    unmount();

    renderProfile({ profile: { id: 2 } });
    await waitFor(() => expect(screen.getByLabelText('Email')).toHaveValue(''));
  });

  it('menyimpan perubahan nama dan email', () => {
    renderProfile();

    fireEvent.change(screen.getByLabelText('Nama'), {
      target: { value: 'Panji Baru' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'baru@mail.com' },
    });
    submitFormOf(screen.getByRole('button', { name: /simpan profil/i }));

    expect(userAction.asyncChangeProfile).toHaveBeenCalledWith({
      name: 'Panji Baru',
      email: 'baru@mail.com',
    });
  });

  it('menampilkan status saat profil sedang disimpan', () => {
    renderProfile({ isChangeProfile: true });
    const button = screen.getByRole('button', { name: /menyimpan/i });
    expect(button).toBeDisabled();
  });

  it('membuka pemilih file saat tombol kamera diklik', () => {
    renderProfile();
    const fileInput = screen.getByLabelText('Pilih file foto profil');
    const clickSpy = vi.spyOn(fileInput, 'click').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Ubah foto profil' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('mengunggah foto profil yang dipilih', () => {
    renderProfile();
    const file = new File(['isi'], 'foto.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Pilih file foto profil'), {
      target: { files: [file] },
    });

    expect(userAction.asyncChangeProfilePhoto).toHaveBeenCalledWith(file);
  });

  it('mengabaikan pemilihan foto yang kosong', () => {
    renderProfile();

    fireEvent.change(screen.getByLabelText('Pilih file foto profil'), {
      target: { files: [] },
    });

    expect(userAction.asyncChangeProfilePhoto).not.toHaveBeenCalled();
  });

  it('menampilkan status saat foto sedang diunggah', () => {
    renderProfile({ isChangeProfilePhoto: true });
    expect(screen.getByText('Mengunggah foto...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ubah foto profil' })
    ).toBeDisabled();
  });

  it('tidak mengirim kata sandi bila konfirmasi tidak cocok', () => {
    renderProfile();
    fillPasswordForm('lama123', 'baru123', 'beda123');

    submitFormOf(screen.getByRole('button', { name: /ubah kata sandi/i }));

    expect(userAction.asyncChangeProfilePassword).not.toHaveBeenCalled();
  });

  it('mengubah kata sandi lalu mengosongkan form', async () => {
    renderProfile();
    fillPasswordForm('lama123', 'baru123', 'baru123');

    submitFormOf(screen.getByRole('button', { name: /ubah kata sandi/i }));

    expect(userAction.asyncChangeProfilePassword).toHaveBeenCalledWith({
      password: 'lama123',
      new_password: 'baru123',
      new_password_confirmation: 'baru123',
    });
    await waitFor(() =>
      expect(screen.getByLabelText('Kata Sandi Lama')).toHaveValue('')
    );
    expect(screen.getByLabelText('Kata Sandi Baru')).toHaveValue('');
    expect(screen.getByLabelText('Konfirmasi Kata Sandi Baru')).toHaveValue('');
  });

  it('menampilkan status saat kata sandi sedang disimpan', () => {
    renderProfile({ isChangeProfilePassword: true });
    expect(screen.getByRole('button', { name: /menyimpan/i })).toBeDisabled();
  });
});