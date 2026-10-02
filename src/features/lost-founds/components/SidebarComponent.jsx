import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiUser, FiX } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/users', label: 'Pengguna', icon: FiUsers },
  { to: '/profile', label: 'Profil Saya', icon: FiUser },
];

export default function SidebarComponent({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-sky-700">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}