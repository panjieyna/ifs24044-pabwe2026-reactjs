import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetUsers } from '../states/action';
import { formatDate, photoUrl } from '../../../helpers/toolsHelper';
import { FiSearch, FiUser } from 'react-icons/fi';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengguna</h1>
        <p className="text-slate-500 text-sm">Daftar semua pengguna sistem</p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            Tidak ada pengguna
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
              >
                <div className="w-12 h-12 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center shrink-0">
                  {user.photo ? (
                    <img
                      src={photoUrl(user.photo)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-sky-600" size={22} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <span className="text-xs text-slate-400 hidden sm:block">
                  {formatDate(user.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}