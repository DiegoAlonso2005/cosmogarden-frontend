import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-xl font-semibold text-slate-900">
            CosmoGarden
          </Link>
          <p className="text-sm text-slate-500">Control administrativo</p>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={logout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Cerrar sesión
            </button>
          )}
          {location.pathname === '/login' && (
            <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
              Ir al panel
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
