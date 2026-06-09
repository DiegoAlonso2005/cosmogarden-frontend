import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { CreateProductPayload, Product } from '../types';

const defaultValues: CreateProductPayload = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductPayload>({ defaultValues });

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
  }, []);

  const onSubmit = async (data: CreateProductPayload) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      reset(defaultValues);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = (product: Product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      quantity: product.quantity,
    });
  };

  const onDelete = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      loadProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setSelectedProduct(null);
    reset(defaultValues);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Productos</h1>
        <p className="mt-2 text-slate-600">Administra el catálogo de productos.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{selectedProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nombre</span>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Descripción</span>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Precio</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'El precio es obligatorio', valueAsNumber: true })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
                {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Cantidad</span>
                <input
                  type="number"
                  {...register('quantity', { required: 'La cantidad es obligatoria', valueAsNumber: true })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
                {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity.message}</p>}
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {selectedProduct ? 'Guardar cambios' : 'Agregar producto'}
              </button>
              {selectedProduct && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Listado de productos</h2>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Precio</th>
                  <th className="px-3 py-2 font-medium">Cantidad</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-3">{product.name}</td>
                    <td className="px-3 py-3">${product.price.toFixed(2)}</td>
                    <td className="px-3 py-3">{product.quantity}</td>
                    <td className="px-3 py-3 space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                      No hay productos registrados.
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
