import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AuthLayout = lazy(() =>
  import('./features/auth/layouts/AuthLayout')
);
const LoginPage = lazy(() =>
  import('./features/auth/pages/LoginPage')
);
const RegisterPage = lazy(() =>
  import('./features/auth/pages/RegisterPage')
);

const LostFoundLayout = lazy(() =>
  import('./features/lost-founds/layouts/LostFoundLayout')
);
const HomePage = lazy(() =>
  import('./features/lost-founds/pages/HomePage')
);
const DetailPage = lazy(() =>
  import('./features/lost-founds/pages/DetailPage')
);
const UsersPage = lazy(() =>
  import('./features/users/pages/UsersPage')
);
const ProfilePage = lazy(() =>
  import('./features/users/pages/ProfilePage')
);

function LoadingPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-slate-50"
      aria-labelledby="app-loading-title"
    >
      <div className="flex flex-col items-center gap-3">
        <h1 id="app-loading-title" className="sr-only">
          Memuat aplikasi Lost & Found
        </h1>

        <div
          className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"
          aria-hidden="true"
        />

        <p className="text-slate-500 text-sm">
          Memuat halaman...
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;