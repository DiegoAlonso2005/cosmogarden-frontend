import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import type { LoginPayload } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginPayload) => {
    setError(null);

    try {
      const response = await api.post('/users/login', data);
      const user = response.data?.user;
      const message = response.data?.message;

      if (!user) {
        setError(message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
        return;
      }

      setToken('cosmogarden-token');
      navigate('/dashboard');
    } catch (err) {
      setError('No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] bg-white px-10 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-8 flex h-11 w-40 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold uppercase tracking-[0.36em] text-emerald-950">
          GreenVivero
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-950">Iniciar sesión</h1>
          <p className="mt-3 text-slate-600">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              {...register('email', { required: 'El email es obligatorio' })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              {...register('password', { required: 'La contraseña es obligatoria' })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              Recordarme
            </label>
            <Link to="/reset-password" className="font-medium text-emerald-700 hover:text-emerald-900">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
