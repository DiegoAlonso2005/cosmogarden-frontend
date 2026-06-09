import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';

interface ResetPayload {
  email: string;
}

export default function ResetPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPayload>({ defaultValues: { email: '' } });

  const onSubmit = async (data: ResetPayload) => {
    setError(null);
    setMessage(null);

    try {
      await api.post('/users/reset-password', data);
      setMessage('Si el correo existe, recibirás instrucciones para restablecer la contraseña.');
    } catch (err) {
      setError('No se pudo procesar la solicitud. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] bg-white px-10 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-8 flex h-11 w-40 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold uppercase tracking-[0.36em] text-emerald-950">
          GreenVivero
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-950">Recuperar contraseña</h1>
          <p className="mt-3 text-slate-600">Ingresa tu correo para recibir el enlace de recuperación.</p>
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

          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
