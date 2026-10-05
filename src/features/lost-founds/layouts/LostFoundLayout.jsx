import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../../../helpers/apiHelper';
import { asyncGetProfile } from '../../users/states/action';
import NavbarComponent from '../components/NavbarComponent';
import SidebarComponent from '../components/SidebarComponent';

export default function LostFoundLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      navigate('/auth/login', { replace: true });
      return;
    }

    async function loadProfile() {
      try {
        await Promise.resolve(dispatch(asyncGetProfile()));
      } catch (error) {
        if (error?.httpStatus === 401) {
          navigate('/auth/login', { replace: true });
          return;
        }

        console.error('Gagal memuat profil:', error);
      }
    }

    loadProfile();
  }, [dispatch, navigate]);

  if (!getAccessToken()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarComponent
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          <h1 className="sr-only">
            Lost & Founds
          </h1>

          <Outlet />
        </main>
      </div>
    </div>
  );
}