import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inventario', path: '/products' },
  { label: 'Ventas', path: '/sales' },
  { label: 'Usuarios', path: '/users' },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 bg-emerald-950 px-6 py-8 text-slate-100 lg:block">
      <div className="mb-10">
        <div className="inline-flex rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-950">
          Green
        </div>
        <h2 className="mt-6 text-3xl font-semibold">Vivero</h2>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-emerald-100 text-emerald-950 shadow-sm' : 'text-slate-200 hover:bg-emerald-900 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
