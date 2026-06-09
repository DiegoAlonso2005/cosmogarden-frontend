import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { CreateSalePayload, Product, Sale } from '../types';

interface SaleFormValues {
  productId: string;
  quantity: number;
}

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SaleFormValues>({ defaultValues: { productId: '', quantity: 1 } });

  const selectedProductId = watch('productId');
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId]
  );

  const total = useMemo(() => {
    if (!selectedProduct) return 0;
    const quantity = Number(watch('quantity')) || 0;
    return selectedProduct.price * quantity;
  }, [selectedProduct, watch('quantity')]);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const onSubmit = async (data: SaleFormValues) => {
    if (!selectedProduct) return;

    try {
      const payload: CreateSalePayload = {
        productId: data.productId,
        quantity: data.quantity,
        total: selectedProduct.price * data.quantity,
      };

      await api.post('/sales', payload);
      reset({ productId: '', quantity: 1 });
      loadSales();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Ventas</h1>
        <p className="mt-2 text-slate-600">Registra nuevas ventas y revisa el historial.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Registrar venta</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Producto</span>
              <select
                {...register('productId', { required: 'Selecciona un producto' })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              >
                <option value="">Selecciona un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && <p className="mt-2 text-sm text-red-600">{errors.productId.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Cantidad</span>
              <input
                type="number"
                min={1}
                {...register('quantity', {
                  required: 'La cantidad es obligatoria',
                  valueAsNumber: true,
                  min: { value: 1, message: 'La cantidad debe ser al menos 1' },
                })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
            </label>

            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              Total estimado: <strong>${total.toFixed(2)}</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Registrar venta
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Historial de ventas</h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 font-medium">Producto</th>
                  <th className="px-3 py-2 font-medium">Cantidad</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                  <th className="px-3 py-2 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-3 py-3">{sale.productName ?? sale.productId}</td>
                    <td className="px-3 py-3">{sale.quantity}</td>
                    <td className="px-3 py-3">${sale.total.toFixed(2)}</td>
                    <td className="px-3 py-3">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                      No hay ventas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
