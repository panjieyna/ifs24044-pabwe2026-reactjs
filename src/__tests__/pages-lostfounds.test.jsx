import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import HomePage from '../features/lost-founds/pages/HomePage';
import DetailPage from '../features/lost-founds/pages/DetailPage';
import * as lfAction from '../features/lost-founds/states/action';
import * as tools from '../helpers/toolsHelper';

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

vi.mock('../helpers/toolsHelper', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, showConfirmDialog: vi.fn() };
});

const items = [
  {
    id: 1,
    title: 'Dompet Hitam',
    description: 'Hilang di kantin',
    status: 'lost',
    is_completed: 0,
    cover: 'covers/dompet.png',
    author: { name: 'Budi' },
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Kunci Motor',
    description: 'Ditemukan di parkiran',
    status: 'found',
    is_completed: 1,
    cover: null,
    author: null,
    created_at: '2026-10-02T10:00:00Z',
  },
  {
    id: 3,
    title: 'Payung Biru',
    description: 'Tertinggal di aula',
    status: 'found',
    is_completed: 0,
    cover: 'https://cdn.example.com/payung.png',
    author: { name: 'Citra' },
    created_at: '2026-10-03T10:00:00Z',
  },
];

function renderHome(lostFounds = items) {
  return renderWithProviders(<HomePage />, {
    preloadedState: { lostFounds: { lostFounds } },
  });
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('menampilkan statistik dan daftar laporan', () => {
    const { container } = renderHome();

    const stats = [...container.querySelectorAll('p.text-2xl')].map(
      (p) => p.textContent
    );
    expect(stats).toEqual(['3', '1', '2', '1']);

    expect(screen.getByText('Dompet Hitam')).toBeInTheDocument();
    expect(screen.getByText('Kunci Motor')).toBeInTheDocument();
    expect(screen.getByText('Payung Biru')).toBeInTheDocument();
    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dompet hitam/i })).toHaveAttribute(
      'href',
      '/lost-founds/1'
    );
  });

  it('memakai url cover yang benar dan lazy loading', () => {
    const { container } = renderHome();
    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      'src',
      'https://open-api.delcom.org/covers/dompet.png'
    );
    expect(images[0]).toHaveAttribute('loading', 'eager');
    expect(images[1]).toHaveAttribute(
      'src',
      'https://cdn.example.com/payung.png'
    );
    expect(images[1]).toHaveAttribute('loading', 'lazy');
  });

  it('menampilkan keadaan kosong', () => {
    renderHome([]);
    expect(screen.getByText('Belum ada laporan')).toBeInTheDocument();
  });

  it('memfilter laporan lewat kolom pencarian', () => {
    renderHome();
    const input = screen.getByPlaceholderText(
      'Cari judul, deskripsi, atau pelapor...'
    );

    fireEvent.change(input, { target: { value: 'budi' } });
    expect(screen.getByText('Dompet Hitam')).toBeInTheDocument();
    expect(screen.queryByText('Kunci Motor')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'parkiran' } });
    expect(screen.getByText('Kunci Motor')).toBeInTheDocument();
    expect(screen.queryByText('Dompet Hitam')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'dompet' } });
    expect(screen.getByText('Dompet Hitam')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'tidak-ada-hasil' } });
    expect(screen.getByText('Belum ada laporan')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(screen.getByText('Dompet Hitam')).toBeInTheDocument();
    expect(screen.getByText('Payung Biru')).toBeInTheDocument();
  });

  it('meminta data ke server sesuai filter yang dipilih', () => {
    renderHome();
    expect(lfAction.asyncGetLostFounds).toHaveBeenLastCalledWith({});

    fireEvent.change(screen.getByLabelText('Filter status laporan'), {
      target: { value: 'lost' },
    });
    expect(lfAction.asyncGetLostFounds).toHaveBeenLastCalledWith({
      status: 'lost',
    });

    fireEvent.change(screen.getByLabelText('Filter status penyelesaian'), {
      target: { value: '0' },
    });
    expect(lfAction.asyncGetLostFounds).toHaveBeenLastCalledWith({
      status: 'lost',
      is_completed: '0',
    });

    fireEvent.click(screen.getByLabelText(/milik saya/i));
    expect(lfAction.asyncGetLostFounds).toHaveBeenLastCalledWith({
      status: 'lost',
      is_completed: '0',
      is_me: 1,
    });
  });

  it('membuka dan menutup modal tambah laporan', () => {
    renderHome();
    expect(
      screen.queryByRole('heading', { name: /tambah laporan/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /tambah laporan/i }));
    expect(
      screen.getByRole('heading', { name: /tambah laporan/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));
    expect(
      screen.queryByRole('heading', { name: /tambah laporan/i })
    ).not.toBeInTheDocument();
  });
});

const baseItem = {
  id: 5,
  user_id: 7,
  title: 'Laptop Abu',
  description: 'Tertinggal di perpustakaan',
  status: 'lost',
  is_completed: 0,
  cover: 'covers/laptop.png',
  author: { name: 'Dewi' },
  created_at: '2026-10-01T10:00:00Z',
  updated_at: '2026-10-02T10:00:00Z',
};

function renderDetail({
  lostFound = baseItem,
  profile = { id: 7 },
  extra = {},
} = {}) {
  return renderWithProviders(
    <Routes>
      <Route path="/lost-founds/:id" element={<DetailPage />} />
      <Route path="/" element={<div>Beranda</div>} />
    </Routes>,
    {
      route: '/lost-founds/5',
      preloadedState: {
        lostFounds: {
          lostFound,
          isLostFound: false,
          isLostFoundDelete: false,
          ...extra,
        },
        users: { profile },
      },
    }
  );
}

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('memuat laporan berdasarkan id pada url', () => {
    renderDetail();
    expect(lfAction.asyncGetLostFoundById).toHaveBeenCalledWith('5');
  });

  it('menampilkan spinner saat data belum ada', () => {
    const { container } = renderDetail({ lostFound: null });
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Laptop Abu')).not.toBeInTheDocument();
  });

  it('menampilkan spinner saat data sedang dimuat', () => {
    const { container } = renderDetail({ extra: { isLostFound: true } });
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('menampilkan detail laporan hilang dengan cover', () => {
    const { container } = renderDetail();

    expect(
      screen.getByRole('heading', { name: 'Laptop Abu' })
    ).toBeInTheDocument();
    expect(screen.getByText('Tertinggal di perpustakaan')).toBeInTheDocument();
    expect(screen.getByText('Hilang')).toBeInTheDocument();
    expect(screen.queryByText('Selesai')).not.toBeInTheDocument();
    expect(screen.getByText(/Dewi/)).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://open-api.delcom.org/covers/laptop.png'
    );
  });

  it('menampilkan laporan temuan yang selesai tanpa cover dan pelapor', () => {
    const { container } = renderDetail({
      lostFound: {
        ...baseItem,
        status: 'found',
        is_completed: 1,
        cover: null,
        author: null,
        updated_at: null,
      },
    });

    expect(screen.getByText('Ditemukan')).toBeInTheDocument();
    expect(screen.getByText('Selesai')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('menyembunyikan tombol aksi bagi bukan pemilik', () => {
    renderDetail({ profile: { id: 99 } });
    expect(
      screen.queryByRole('button', { name: /ubah data/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /hapus/i })
    ).not.toBeInTheDocument();
  });

  it('menyembunyikan tombol aksi saat profil belum ada', () => {
    renderDetail({ profile: null });
    expect(
      screen.queryByRole('button', { name: /ubah cover/i })
    ).not.toBeInTheDocument();
  });

  it('membuka dan menutup modal ubah data', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: /ubah data/i }));
    expect(
      screen.getByRole('heading', { name: /ubah laporan/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));
    expect(
      screen.queryByRole('heading', { name: /ubah laporan/i })
    ).not.toBeInTheDocument();
  });

  it('membuka dan menutup modal ubah cover', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: /ubah cover/i }));
    expect(
      screen.getByRole('heading', { name: /ubah cover/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));
    expect(
      screen.queryByRole('heading', { name: /ubah cover/i })
    ).not.toBeInTheDocument();
  });

  it('menghapus laporan setelah konfirmasi lalu kembali ke beranda', async () => {
    tools.showConfirmDialog.mockResolvedValueOnce({ isConfirmed: true });
    renderDetail();

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    expect(await screen.findByText('Beranda')).toBeInTheDocument();
    expect(lfAction.asyncDeleteLostFound).toHaveBeenCalledWith('5');
  });

  it('tidak menghapus laporan saat konfirmasi dibatalkan', async () => {
    tools.showConfirmDialog.mockResolvedValueOnce({ isConfirmed: false });
    renderDetail();

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => expect(tools.showConfirmDialog).toHaveBeenCalled());
    expect(lfAction.asyncDeleteLostFound).not.toHaveBeenCalled();
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
  });

  it('tetap di halaman saat penghapusan gagal', async () => {
    tools.showConfirmDialog.mockResolvedValueOnce({ isConfirmed: true });
    lfAction.asyncDeleteLostFound.mockImplementationOnce(() => async () => {
      throw new Error('gagal');
    });
    renderDetail();

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() =>
      expect(lfAction.asyncDeleteLostFound).toHaveBeenCalled()
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Laptop Abu' })
    ).toBeInTheDocument();
  });

  it('menonaktifkan tombol hapus saat proses penghapusan berjalan', () => {
    renderDetail({ extra: { isLostFoundDelete: true } });
    expect(screen.getByRole('button', { name: /hapus/i })).toBeDisabled();
  });
});