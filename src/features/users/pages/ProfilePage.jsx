import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from '../states/action';
import useInput from '../../../hooks/useInput';
import { photoUrl } from '../../../helpers/toolsHelper';
import { FiUser, FiCamera, FiSave, FiLock } from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const {
    profile,
    isChangeProfile,
    isChangeProfilePhoto,
    isChangeProfilePassword,
  } = useSelector((state) => state.users);

  const [name, onNameChange, setName] = useInput('');
  const [email, onEmailChange, setEmail] = useInput('');
  const [password, onPasswordChange, setPassword] = useInput('');
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput('');
  const [confirmPassword, onConfirmPasswordChange, setConfirmPassword] =
    useInput('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile, setName, setEmail]);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    await dispatch(asyncChangeProfile({ name, email }));
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      await dispatch(asyncChangeProfilePhoto(file));
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return;
    }
    await dispatch(
      asyncChangeProfilePassword({
        password,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
    );
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-slate-500 text-sm">Kelola informasi akun Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center">
            {profile?.photo ? (
              <img
                src={photoUrl(profile.photo)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-sky-600" size={36} />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isChangeProfilePhoto}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shadow hover:bg-sky-700 disabled:opacity-50"
          >
            <FiCamera size={14} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="font-semibold text-lg text-slate-800">
            {profile?.name}
          </p>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
          {isChangeProfilePhoto && (
            <p className="text-xs text-sky-600 mt-1">Mengunggah foto...</p>
          )}
        </div>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
      >
        <h2 className="font-semibold text-slate-800">Informasi Profil</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={onNameChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isChangeProfile}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold px-4 py-2.5 rounded-xl"
        >
          <FiSave size={16} />
          {isChangeProfile ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
      >
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <FiLock size={18} /> Ubah Kata Sandi
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kata Sandi Lama
          </label>
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kata Sandi Baru
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={onNewPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isChangeProfilePassword}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold px-4 py-2.5 rounded-xl"
        >
          <FiLock size={16} />
          {isChangeProfilePassword ? 'Menyimpan...' : 'Ubah Kata Sandi'}
        </button>
      </form>
    </div>
  );
}