import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiUser, FiX } from 'react-icons/fi';

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/users', label: 'Pengguna', icon: FiUsers },
  { to: '/profile', label: 'Profil Saya', icon: FiUser },
];

function SidebarComponent({ open, onClose }) {
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
        aria-label="Sidebar navigasi"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-sky-800">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            aria-label="Tutup menu navigasi"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Navigasi utama">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-800'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

SidebarComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default SidebarComponent;
