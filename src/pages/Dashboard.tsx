import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [productCount, setProductCount] = useState<number>(0);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [productsResponse, salesResponse, usersResponse] = await Promise.all([
          api.get('/products'),
          api.get('/sales'),
          api.get('/users'),
        ]);

        setProductCount(Array.isArray(productsResponse.data) ? productsResponse.data.length : 0);
        setSalesCount(Array.isArray(salesResponse.data) ? salesResponse.data.length : 0);
        setUserCount(Array.isArray(usersResponse.data) ? usersResponse.data.length : 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-700">Panel General</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-slate-600">Visualiza el estado de tu vivero en tiempo real.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="search"
            placeholder="Buscar plantas, especies o ID..."
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Total Productos</span>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">OK</span>
          </div>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{loading ? '...' : productCount}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Total Ventas</span>
            <span className="inline-flex rounded-full bg-lime-100 px-3 py-1 text-lime-700">OK</span>
          </div>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{loading ? '...' : salesCount}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Total Usuarios</span>
            <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-cyan-700">OK</span>
          </div>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{loading ? '...' : userCount}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Ingresos</span>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">OK</span>
          </div>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{loading ? '...' : '$' + (salesCount * 15).toFixed(0)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Inventario</h2>
            <p className="mt-1 text-sm text-slate-500">Visualiza tus productos y acciones rápidas.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
              Interior
            </button>
            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
              Exterior
            </button>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre común</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Salud</th>
                <th className="px-4 py-3">Último riego</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-4 text-slate-700">VIV-001</td>
                <td className="px-4 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100" />
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">Echeveria Elegans</div>
                  <div className="text-sm text-slate-500">Echeveria Elegans</div>
                </td>
                <td className="px-4 py-4 text-slate-700">Zona A-3</td>
                <td className="px-4 py-4 text-slate-700">209</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Excelente
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">Hace 2 días</td>
                <td className="px-4 py-4 space-x-2">
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    Editar
                  </button>
                  <button className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                    Borrar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-700">VIV-002</td>
                <td className="px-4 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100" />
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">Lavandula Angustifolia</div>
                  <div className="text-sm text-slate-500">Lavandula Angustifolia</div>
                </td>
                <td className="px-4 py-4 text-slate-700">Zona B-2</td>
                <td className="px-4 py-4 text-slate-700">28</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Bajo Stock
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">Hace 7 días</td>
                <td className="px-4 py-4 space-x-2">
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    Editar
                  </button>
                  <button className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                    Borrar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
