import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncGetLostFoundById,
  asyncDeleteLostFound,
} from '../states/action';
import {
  formatDate,
  coverUrl,
  showConfirmDialog,
} from '../../../helpers/toolsHelper';
import ChangeModal from '../modals/ChangeModal';
import ChangeCoverModal from '../modals/ChangeCoverModal';
import {
  FiArrowLeft,
  FiEdit2,
  FiImage,
  FiTrash2,
  FiPackage,
} from 'react-icons/fi';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lostFound, isLostFound, isLostFoundDelete } = useSelector(
    (state) => state.lostFounds
  );
  const profile = useSelector((state) => state.users.profile);
  const [showChange, setShowChange] = useState(false);
  const [showCover, setShowCover] = useState(false);

  useEffect(() => {
    dispatch(asyncGetLostFoundById(id));
  }, [dispatch, id]);

  const isOwner = profile && lostFound && profile.id === lostFound.user_id;

  async function handleDelete() {
    const result = await showConfirmDialog(
      'Hapus laporan?',
      'Tindakan ini tidak dapat dibatalkan.',
      'Hapus',
      'Batal'
    );
    if (result.isConfirmed) {
      try {
        await dispatch(asyncDeleteLostFound(id));
        navigate('/', { replace: true });
      } catch {
        // handled
      }
    }
  }

  if (isLostFound || !lostFound) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600"
      >
        <FiArrowLeft /> Kembali
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="aspect-video bg-slate-100 relative">
          {lostFound.cover ? (
            <img
              src={coverUrl(lostFound.cover)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <FiPackage size={64} />
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                lostFound.status === 'lost'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {lostFound.status === 'lost' ? 'Hilang' : 'Ditemukan'}
            </span>
            {lostFound.is_completed === 1 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                Selesai
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-800">{lostFound.title}</h1>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
            {lostFound.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
            <div>
              <span className="block text-xs text-slate-400">Pelapor</span>
              {lostFound.author?.name || '-'}
            </div>
            <div>
              <span className="block text-xs text-slate-400">Dilaporkan</span>
              {formatDate(lostFound.created_at)}
            </div>
            <div>
              <span className="block text-xs text-slate-400">Diperbarui</span>
              {formatDate(lostFound.updated_at)}
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowChange(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FiEdit2 size={16} /> Ubah Data
              </button>
              <button
                type="button"
                onClick={() => setShowCover(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FiImage size={16} /> Ubah Cover
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLostFoundDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <FiTrash2 size={16} /> Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      {showChange && (
        <ChangeModal item={lostFound} onClose={() => setShowChange(false)} />
      )}
      {showCover && (
        <ChangeCoverModal item={lostFound} onClose={() => setShowCover(false)} />
      )}
    </div>
  );
}