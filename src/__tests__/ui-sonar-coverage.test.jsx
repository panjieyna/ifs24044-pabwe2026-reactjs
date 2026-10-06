import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import NavbarComponent from '../features/lost-founds/components/NavbarComponent';
import SidebarComponent from '../features/lost-founds/components/SidebarComponent';
import AddModal from '../features/lost-founds/modals/AddModal';
import ChangeModal from '../features/lost-founds/modals/ChangeModal';
import ChangeCoverModal from '../features/lost-founds/modals/ChangeCoverModal';
import RegisterPage from '../features/auth/pages/RegisterPage';

vi.mock('../features/auth/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetIsAuthLogout: () => async () => {},
    asyncSetIsAuthRegister: () => async () => {},
  };
});

vi.mock('../features/lost-founds/states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncAddLostFound: () => async () => {},
    asyncChangeLostFound: () => async () => {},
    asyncChangeLostFoundCover: () => async () => {},
    asyncGetLostFoundById: () => async () => {},
  };
});

describe('UI coverage for sonar new code', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders NavbarComponent', () => {
    renderWithProviders(
      <NavbarComponent onToggleSidebar={vi.fn()} />,
      {
        preloadedState: {
          users: {
            profile: { id: 1, name: 'Panji', email: 'a@b.c' },
            users: [],
            isProfile: false,
          },
        },
      }
    );
    expect(screen.getByLabelText(/buka menu/i)).toBeInTheDocument();
  });

  it('renders SidebarComponent open and closed', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(
      <SidebarComponent open onClose={onClose} />
    );
    expect(screen.getByLabelText(/sidebar navigasi/i)).toBeInTheDocument();
    rerender(
      <SidebarComponent open={false} onClose={onClose} />
    );
  });

  it('renders AddModal', () => {
    renderWithProviders(<AddModal onClose={vi.fn()} />);
    expect(screen.getByText(/tambah|laporan|judul/i)).toBeTruthy();
  });

  it('renders ChangeModal', () => {
    renderWithProviders(
      <ChangeModal
        item={{
          id: 1,
          title: 'Dompet',
          description: 'Hitam',
          status: 'lost',
          is_completed: 0,
        }}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('Dompet')).toBeInTheDocument();
    expect(screen.getByText(/tandai sebagai selesai/i)).toBeInTheDocument();
  });

  it('renders ChangeCoverModal and click zone is button', () => {
    renderWithProviders(
      <ChangeCoverModal item={{ id: 2 }} onClose={vi.fn()} />
    );
    expect(screen.getByText(/ubah cover/i)).toBeInTheDocument();
    const pick = screen.getByText(/klik untuk pilih gambar/i);
    expect(pick).toBeInTheDocument();
    // parent should be button
    expect(pick.closest('button')).toBeTruthy();
  });

  it('renders RegisterPage labels', () => {
    renderWithProviders(<RegisterPage />, { route: '/auth/register' });
    expect(screen.getByLabelText(/nama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
