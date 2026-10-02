import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetLostFounds, asyncGetLostFoundStats } from '../states/action';
import { formatDate, coverUrl } from '../../../helpers/toolsHelper';
import AddModal from '../modals/AddModal';
import {
  FiPlus,
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

export default function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds } = useSelector((state) => state.lostFounds);
  const [status, setStatus] = useState('');
  const [isCompleted, setIsCompleted] = useState('');
  const [isMe, setIsMe] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const params = {};
    if (status) params.status = status;
    if (isCompleted !== '') params.is_completed = isCompleted;
    if (isMe) params.is_me = 1;
    dispatch(asyncGetLostFounds(params));
  }, [dispatch, status, isCompleted, isMe]);

  useEffect(() => {
    dispatch(asyncGetLostFoundStats());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return lostFounds;
    const q = search.toLowerCase();
    return lostFounds.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.author?.name?.toLowerCase().includes(q)
    );
  }, [lostFounds, search]);

  const stats = useMemo(() => {
    const total = lostFounds.length;
    const lost = lostFounds.filter((i) => i.status === 'lost').length;
    const found = lostFounds.filter((i) => i.status === 'found').length;
    const completed = lostFounds.filter((i) => i.is_completed === 1).length;
    return { total, lost, found, completed };
  }, [lostFounds]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Kelola laporan barang hilang & temuan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <FiPlus /> Tambah Laporan
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total',
            value: stats.total,
            icon: FiPackage,
            color: 'bg-slate-100 text-slate-700',
          },
          {
            label: 'Hilang',
            value: stats.lost,
            icon: FiAlertCircle,
            color: 'bg-amber-50 text-amber-700',
          },
          {
            label: 'Ditemukan',
            value: stats.found,
            icon: FiCheckCircle,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            label: 'Selesai',
            value: stats.completed,
            icon: FiCheckCircle,
            color: 'bg-sky-50 text-sky-700',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}
            >
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, deskripsi, atau pelapor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
          >
            <option value="">Semua Status</option>
            <option value="lost">Hilang</option>
            <option value="found">Ditemukan</option>
          </select>
          <select
            value={isCompleted}
            onChange={(e) => setIsCompleted(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
          >
            <option value="">Semua Progres</option>
            <option value="0">Proses</option>
            <option value="1">Selesai</option>
          </select>
          <label className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isMe}
              onChange={(e) => setIsMe(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Milik Saya
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FiPackage size={40} className="mx-auto mb-3 opacity-50" />
            <p>Belum ada laporan</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Link
                key={item.id}
                to={`/lost-founds/${item.id}`}
                className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  {item.cover ? (
                    <img
                      src={coverUrl(item.cover)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FiPackage size={32} />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.status === 'lost'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status === 'lost' ? 'Hilang' : 'Ditemukan'}
                  </span>
                  {item.is_completed === 1 && (
                    <span className="absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                      Selesai
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-sky-700">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                    <span>{item.author?.name || '-'}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}