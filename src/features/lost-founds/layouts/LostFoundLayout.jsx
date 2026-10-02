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
      if (!getAccessToken()) {
        navigate('/auth/login', { replace: true });
        return;
      }
      try {
        await dispatch(asyncGetProfile());
        setReady(true);
      } catch {
        navigate('/auth/login', { replace: true });
      }
    }
    init();
  }, [dispatch, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}