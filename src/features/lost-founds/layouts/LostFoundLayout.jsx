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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const token = getAccessToken();

      if (!token) {
        navigate('/auth/login', { replace: true });
        return;
      }

      try {
        await dispatch(asyncGetProfile());
      } catch (error) {
        if (error?.httpStatus === 401) {
          navigate('/auth/login', { replace: true });
          return;
        }

        console.error('Gagal memuat profil:', error);
      }

      setReady(true);
    }

    init();
  }, [dispatch, navigate]);

  if (!ready) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-slate-50"
        aria-labelledby="loading-title"
      >
        <div className="flex flex-col items-center gap-3">
          <h1
            id="loading-title"
            className="sr-only"
          >
            Memuat aplikasi Lost & Founds
          </h1>

          <div
            className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"
            aria-hidden="true"
          />

          <p className="text-slate-500 text-sm">
            Memuat sesi...
          </p>
        </div>
      </main>
    );
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