import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetIsAuthLogout } from '../../auth/states/action';
import { photoUrl } from '../../../helpers/toolsHelper';
import { FiMenu, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

export default function NavbarComponent({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.users.profile);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    await dispatch(asyncSetIsAuthLogout());
    navigate('/auth/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 h-16 flex items-center px-4 gap-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        aria-label="Toggle menu"
      >
        <FiMenu size={22} />
      </button>

      <Link
        to="/"
        className="font-bold text-lg text-sky-700 flex items-center gap-2"
      >
        <span className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center text-sm font-extrabold">
          LF
        </span>
        <span className="hidden sm:inline">Lost & Found</span>
      </Link>

      <div className="flex-1" />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition"
        >
          <div className="w-9 h-9 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              <img
                src={photoUrl(profile.photo)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-sky-600" />
            )}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
            {profile?.name || 'Pengguna'}
          </span>
          <FiChevronDown className="text-slate-400" size={16} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <FiUser size={16} /> Profil Saya
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}