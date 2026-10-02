import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../../helpers/apiHelper';

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getAccessToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="hidden md:flex md:w-1/2 bg-sky-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-20 right-16 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-4xl font-extrabold mb-4">Lost & Found</h1>
          <p className="text-sky-100 text-lg leading-relaxed">
            Laporkan barang hilang atau temuan dengan mudah. Bantu komunitas
            menemukan kembali barang berharga mereka.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}