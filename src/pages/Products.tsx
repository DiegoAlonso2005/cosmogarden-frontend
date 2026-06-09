import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { CreateProductPayload, Product } from '../types';

interface ProductFormValues {
  code: string;
  name: string;
  species: string;
  category: string;
  location: string;
  price: number;
  stock: number;
  health: string;
  watered: string;
}

const defaultValues: ProductFormValues = {
  code: '',
  name: '',
  species: '',
  category: 'All',
  location: '',
  price: 0,
  stock: 0,
  health: 'Excelente',
  watered: 'Hace 1 día',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ defaultValues });

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

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      reset(defaultValues);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const onEdit = (product: Product) => {
    setSelectedProduct(product);
    reset({
      code: product.code ?? '',
      name: product.name ?? '',
      species: product.species ?? '',
      category: product.category ?? 'All',
      location: product.location ?? '',
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      health: product.health ?? 'Excelente',
      watered: product.watered ?? 'Hace 1 día',
    });
  };

  const onDelete = async (productId: number | string | undefined) => {
    if (!productId) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await api.delete(`/products/${productId}`);
      await loadProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
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
              <span className="text-sm font-medium text-slate-700">Código</span>
              <input
                {...register('code')}
                placeholder="VIV-001"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nombre</span>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Especie</span>
              <input
                {...register('species')}
                placeholder="Ej: Echeveria Elegans"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Categoría</span>
              <select
                {...register('category')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              >
                <option value="All">Todas</option>
                <option value="Interior">Interior</option>
                <option value="Exterior">Exterior</option>
                <option value="Arbustos">Arbustos</option>
                <option value="Flores">Flores</option>
                <option value="Suculentas">Suculentas</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ubicación</span>
              <input
                {...register('location')}
                placeholder="Ej: Zona A-3"
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
                <span className="text-sm font-medium text-slate-700">Stock</span>
                <input
                  type="number"
                  {...register('stock', { required: 'El stock es obligatorio', valueAsNumber: true })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                />
                {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock.message}</p>}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Estado de salud</span>
              <select
                {...register('health')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              >
                <option value="Excelente">Excelente</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Necesita atención">Necesita atención</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Último riego</span>
              <input
                {...register('watered')}
                placeholder="Ej: Hace 2 días"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </label>

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
                  <th className="px-3 py-2 font-medium">Stock</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-3 py-3">{product.name}</td>
                    <td className="px-3 py-3">${(product.price ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-3">{product.stock ?? 0}</td>
                    <td className="px-3 py-3 space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700 transition"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 transition"
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
