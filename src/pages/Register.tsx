import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { CreateUserPayload } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserPayload>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: CreateUserPayload) => {
    setError(null);
    setMessage(null);

    try {
      await api.post('/users', data);
      setMessage('Usuario creado correctamente. Ahora puedes iniciar sesión.');
      reset({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError('No se pudo crear el usuario. Intenta con otro correo.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] bg-white px-10 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-8 flex h-11 w-40 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold uppercase tracking-[0.36em] text-emerald-950">
          GreenVivero
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-950">Regístrate</h1>
          <p className="mt-3 text-slate-600">Crea una cuenta para acceder al panel.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              {...register('name', { required: 'El nombre es obligatorio' })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

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
              placeholder="Crea una contraseña"
              {...register('password', { required: 'La contraseña es obligatoria' })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
