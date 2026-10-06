import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import NavbarComponent from '../features/lost-founds/components/NavbarComponent';
import AddModal from '../features/lost-founds/modals/AddModal';
import ChangeModal from '../features/lost-founds/modals/ChangeModal';
import ChangeCoverModal from '../features/lost-founds/modals/ChangeCoverModal';
import * as lfAction from '../features/lost-founds/states/action';
import * as authAction from '../features/auth/states/action';

vi.mock('../features/auth/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetIsAuthLogout: vi.fn(() => async () => {}),
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
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:preview-cover');
});

describe('NavbarComponent', () => {
  function renderNavbar({ onToggleSidebar = vi.fn(), profile = null } = {}) {
    return renderWithProviders(
      <Routes>
        <Route path="/auth/login" element={<div>Halaman Login</div>} />
        <Route
          path="*"
          element={<NavbarComponent onToggleSidebar={onToggleSidebar} />}
        />
      </Routes>,
      { preloadedState: { users: { profile } } }
    );
  }

  it('menampilkan nama pengguna dan foto profil', () => {
    const { container } = renderNavbar({
      profile: { name: 'Panji', photo: 'photos/panji.png' },
    });

    expect(screen.getByText('Panji')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://open-api.delcom.org/photos/panji.png'
    );
  });

  it('menampilkan nama bawaan saat profil belum ada', () => {
    renderNavbar();
    expect(screen.getByText('Pengguna')).toBeInTheDocument();
  });

  it('memanggil callback saat tombol menu navigasi diklik', () => {
    const onToggleSidebar = vi.fn();
    renderNavbar({ onToggleSidebar });

    fireEvent.click(screen.getByLabelText('Buka menu navigasi'));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('membuka dan menutup menu profil', () => {
    renderNavbar();
    const trigger = screen.getByRole('button', { name: 'Menu profil' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('menutup menu saat klik di luar tetapi tidak saat klik di dalam', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));

    fireEvent.mouseDown(screen.getByRole('menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('menutup menu setelah memilih Profil Saya', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));

    fireEvent.click(screen.getByRole('menuitem', { name: /profil saya/i }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keluar dari akun lalu menuju halaman login', async () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Keluar dari akun' }));

    expect(await screen.findByText('Halaman Login')).toBeInTheDocument();
    expect(authAction.asyncSetIsAuthLogout).toHaveBeenCalledTimes(1);
  });
});

function pressSubmit(container) {
  fireEvent.submit(container.querySelector('form'));
}

describe('AddModal', () => {
  it('menampilkan pesan error bila judul atau deskripsi kosong', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<AddModal onClose={onClose} />);

    pressSubmit(container);

    expect(
      screen.getByText('Judul dan deskripsi wajib diisi')
    ).toBeInTheDocument();
    expect(lfAction.asyncAddLostFound).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('mengirim laporan baru lalu menutup modal', async () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<AddModal onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Tas Biru' },
    });
    fireEvent.change(container.querySelector('textarea'), {
      target: { value: 'Tertinggal di kelas' },
    });
    fireEvent.click(screen.getByLabelText('Ditemukan'));
    pressSubmit(container);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(lfAction.asyncAddLostFound).toHaveBeenCalledWith({
      title: 'Tas Biru',
      description: 'Tertinggal di kelas',
      status: 'found',
    });
    expect(lfAction.asyncGetLostFounds).toHaveBeenCalled();
  });

  it('tidak menutup modal saat pengiriman gagal', async () => {
    lfAction.asyncAddLostFound.mockImplementationOnce(() => async () => {
      throw new Error('gagal');
    });
    const onClose = vi.fn();
    const { container } = renderWithProviders(<AddModal onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Tas Biru' },
    });
    fireEvent.change(container.querySelector('textarea'), {
      target: { value: 'Tertinggal di kelas' },
    });
    pressSubmit(container);

    await waitFor(() => expect(lfAction.asyncAddLostFound).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('menutup modal lewat tombol Batal dan Tutup dialog', () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('menampilkan status saat laporan sedang disimpan', () => {
    renderWithProviders(<AddModal onClose={vi.fn()} />, {
      preloadedState: { lostFounds: { isLostFoundAdd: true } },
    });

    expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled();
  });
});

const item = {
  id: 3,
  title: 'Dompet',
  description: 'Warna hitam',
  status: 'lost',
  is_completed: 0,
};

describe('ChangeModal', () => {
  it('menampilkan data laporan yang akan diubah', () => {
    renderWithProviders(<ChangeModal item={item} onClose={vi.fn()} />);

    expect(screen.getByLabelText('Judul')).toHaveValue('Dompet');
    expect(screen.getByLabelText('Deskripsi')).toHaveValue('Warna hitam');
    expect(screen.getByLabelText('Hilang')).toBeChecked();
    expect(screen.getByLabelText(/tandai sebagai selesai/i)).not.toBeChecked();
  });

  it('menyimpan perubahan lalu menutup modal', async () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangeModal item={item} onClose={onClose} />
    );

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Dompet Baru' },
    });
    fireEvent.change(screen.getByLabelText('Deskripsi'), {
      target: { value: 'Warna cokelat' },
    });
    fireEvent.click(screen.getByLabelText('Ditemukan'));
    fireEvent.click(screen.getByLabelText(/tandai sebagai selesai/i));
    pressSubmit(container);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(lfAction.asyncChangeLostFound).toHaveBeenCalledWith(3, {
      title: 'Dompet Baru',
      description: 'Warna cokelat',
      status: 'found',
      is_completed: 1,
    });
    expect(lfAction.asyncGetLostFoundById).toHaveBeenCalledWith(3);
  });

  it('mengirim is_completed 0 bila tidak dicentang', async () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangeModal item={item} onClose={onClose} />
    );

    pressSubmit(container);

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(lfAction.asyncChangeLostFound).toHaveBeenCalledWith(3, {
      title: 'Dompet',
      description: 'Warna hitam',
      status: 'lost',
      is_completed: 0,
    });
  });

  it('menampilkan centang bila laporan sudah selesai', () => {
    renderWithProviders(
      <ChangeModal item={{ ...item, is_completed: 1 }} onClose={vi.fn()} />
    );
    expect(screen.getByLabelText(/tandai sebagai selesai/i)).toBeChecked();
  });

  it('menampilkan error saat judul dikosongkan', () => {
    const { container } = renderWithProviders(
      <ChangeModal item={item} onClose={vi.fn()} />
    );

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: '   ' },
    });
    pressSubmit(container);

    expect(
      screen.getByText('Judul dan deskripsi wajib diisi')
    ).toBeInTheDocument();
    expect(lfAction.asyncChangeLostFound).not.toHaveBeenCalled();
  });

  it('memakai nilai bawaan bila item tidak diberikan', () => {
    const { container } = renderWithProviders(
      <ChangeModal onClose={vi.fn()} />
    );

    expect(screen.getByLabelText('Judul')).toHaveValue('');
    pressSubmit(container);
    expect(
      screen.getByText('Judul dan deskripsi wajib diisi')
    ).toBeInTheDocument();
  });

  it('tidak menutup modal saat penyimpanan gagal', async () => {
    lfAction.asyncChangeLostFound.mockImplementationOnce(() => async () => {
      throw new Error('gagal');
    });
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangeModal item={item} onClose={onClose} />
    );

    pressSubmit(container);

    await waitFor(() =>
      expect(lfAction.asyncChangeLostFound).toHaveBeenCalled()
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('menutup modal lewat tombol Batal dan Tutup dialog', () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal item={item} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('menampilkan status saat perubahan sedang disimpan', () => {
    renderWithProviders(<ChangeModal item={item} onClose={vi.fn()} />, {
      preloadedState: { lostFounds: { isLostFoundChange: true } },
    });

    expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled();
  });
});

describe('ChangeCoverModal', () => {
  const file = new File(['gambar'], 'cover.png', { type: 'image/png' });

  it('membuka pemilih file saat area unggah diklik', () => {
    renderWithProviders(<ChangeCoverModal item={{ id: 3 }} onClose={vi.fn()} />);
    const input = screen.getByLabelText('Pilih gambar cover');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});

    fireEvent.click(
      screen.getByText('Klik untuk pilih gambar').closest('button')
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('menampilkan pratinjau lalu mengunggah cover', async () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangeCoverModal item={{ id: 3 }} onClose={onClose} />
    );
    expect(screen.getByRole('button', { name: /unggah/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Pilih gambar cover'), {
      target: { files: [file] },
    });

    expect(await screen.findByAltText('Preview')).toHaveAttribute(
      'src',
      'blob:preview-cover'
    );
    expect(screen.getByRole('button', { name: /unggah/i })).toBeEnabled();

    pressSubmit(container);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(lfAction.asyncChangeLostFoundCover).toHaveBeenCalledWith(3, file);
    expect(lfAction.asyncGetLostFoundById).toHaveBeenCalledWith(3);
  });

  it('mengabaikan pemilihan file yang kosong', () => {
    renderWithProviders(<ChangeCoverModal item={{ id: 3 }} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Pilih gambar cover'), {
      target: { files: [] },
    });

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unggah/i })).toBeDisabled();
  });

  it('tidak mengunggah bila belum ada file yang dipilih', () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal item={{ id: 3 }} onClose={vi.fn()} />
    );

    pressSubmit(container);

    expect(lfAction.asyncChangeLostFoundCover).not.toHaveBeenCalled();
  });

  it('tidak menutup modal saat unggahan gagal', async () => {
    lfAction.asyncChangeLostFoundCover.mockImplementationOnce(
      () => async () => {
        throw new Error('gagal');
      }
    );
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangeCoverModal item={{ id: 3 }} onClose={onClose} />
    );

    fireEvent.change(screen.getByLabelText('Pilih gambar cover'), {
      target: { files: [file] },
    });
    pressSubmit(container);

    await waitFor(() =>
      expect(lfAction.asyncChangeLostFoundCover).toHaveBeenCalled()
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('menutup modal lewat tombol Batal dan Tutup dialog', () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal item={{ id: 3 }} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('menampilkan status saat cover sedang diunggah', () => {
    renderWithProviders(<ChangeCoverModal item={{ id: 3 }} onClose={vi.fn()} />, {
      preloadedState: { lostFounds: { isLostFoundChangeCover: true } },
    });

    expect(
      screen.getByRole('button', { name: 'Mengunggah...' })
    ).toBeDisabled();
  });
});