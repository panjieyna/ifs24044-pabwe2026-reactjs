import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncChangeLostFoundCover,
  asyncGetLostFoundById,
} from '../states/action';
import { FiX, FiUpload, FiImage } from 'react-icons/fi';

export default function ChangeCoverModal({ item, onClose }) {
  const dispatch = useDispatch();
  const { isLostFoundChangeCover } = useSelector((state) => state.lostFounds);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    try {
      await dispatch(asyncChangeLostFoundCover(item.id, file));
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
          <h3 className="font-bold text-lg text-slate-800">Ubah Cover</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
            ) : (
              <div className="text-slate-400">
                <FiImage size={40} className="mx-auto mb-2" />
                <p className="text-sm">Klik untuk pilih gambar</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!file || isLostFoundChangeCover}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold"
            >
              <FiUpload />
              {isLostFoundChangeCover ? 'Mengunggah...' : 'Unggah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}