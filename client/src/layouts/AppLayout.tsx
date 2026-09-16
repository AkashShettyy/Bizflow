import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

function AppLayout() {
  const { user, tenant, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Customers",
      path: "/customers",
    },
    {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
    {
      name: "Invoices",
      path: "/invoices",
    },
    {
      name: "Reports",
      path: "/reports",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="border-b px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">BizFlow</h1>

          <p className="mt-1 truncate text-sm text-slate-500">{tenant?.name}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>

            <p className="font-semibold text-slate-900">{user?.name}</p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {tenant?.name}
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
