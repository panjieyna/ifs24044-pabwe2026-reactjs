import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetIsAuthLogin } from '../states/action';
import useInput from '../../../hooks/useInput';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthLogin } = useSelector((state) => state.auth);
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }
    try {
      await dispatch(asyncSetIsAuthLogin({ email, password }));
      navigate('/', { replace: true });
    } catch {
      // error sudah ditampilkan via dialog
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Masuk</h2>
        <p className="text-slate-500 mt-1">Selamat datang kembali</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div>
  <label
    htmlFor="login-email-input"
    className="block text-sm font-medium text-slate-700 mb-1.5"
  >
    Email
  </label>
  <div className="relative">
    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    <input
      id="login-email-input"
      type="email"
      autoComplete="email"
      value={email}
      onChange={onEmailChange}
      placeholder="nama@email.com"
      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
      required
    />
  </div>
</div>

<div>
  <label
    htmlFor="login-password-input"
    className="block text-sm font-medium text-slate-700 mb-1.5"
  >
    Kata Sandi
  </label>
  <div className="relative">
    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    <input
      id="login-password-input"
      type="password"
      autoComplete="current-password"
      value={password}
      onChange={onPasswordChange}
      placeholder="••••••••"
      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
      required
    />
  </div>
</div>

<button
  id="login-submit-button"
  type="submit"
  disabled={isAuthLogin}
  className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-2.5 rounded-xl transition"
>
  <FiLogIn aria-hidden="true" />
  {isAuthLogin ? 'Memproses...' : 'Masuk'}
</button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Belum punya akun?{' '}
        <Link
          to="/auth/register"
          className="text-sky-600 font-semibold hover:underline"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}