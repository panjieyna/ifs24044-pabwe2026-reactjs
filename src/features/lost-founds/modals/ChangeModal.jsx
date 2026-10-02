import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncChangeLostFound, asyncGetLostFoundById } from '../states/action';
import useInput from '../../../hooks/useInput';
import { FiX } from 'react-icons/fi';

export default function ChangeModal({ item, onClose }) {
  const dispatch = useDispatch();
  const { isLostFoundChange } = useSelector((state) => state.lostFounds);
  const [title, onTitleChange, setTitle] = useInput(item?.title || '');
  const [description, onDescriptionChange, setDescription] = useInput(
    item?.description || ''
  );
  const [status, setStatus] = useState(item?.status || 'lost');
  const [isCompleted, setIsCompleted] = useState(item?.is_completed === 1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setStatus(item.status || 'lost');
      setIsCompleted(item.is_completed === 1);
    }
  }, [item, setTitle, setDescription]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !description.trim()) {
      setError('Judul dan deskripsi wajib diisi');
      return;
    }
    try {
      await dispatch(
        asyncChangeLostFound(item.id, {
          title,
          description,
          status,
          is_completed: isCompleted ? 1 : 0,
        })
      );
      await dispatch(asyncGetLostFoundById(item.id));
      onClose();
    } catch {
      // handled
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Ubah Laporan</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={onTitleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={onDescriptionChange}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
            <div className="flex gap-3">
              {['lost', 'found'].map((s) => (
                <label
                  key={s}
                  className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition ${
                    status === s
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="sr-only"
                  />
                  {s === 'lost' ? 'Hilang' : 'Ditemukan'}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Tandai sebagai selesai
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChange}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold"
            >
              {isLostFoundChange ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}