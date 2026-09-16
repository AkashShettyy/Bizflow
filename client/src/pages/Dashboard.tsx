import { useAuth } from "../context/AuthContext.js";

function Dashboard() {
  const { user, tenant, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              BizFlow
            </h1>
            <p className="text-sm text-slate-500">
              {tenant?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h2>

        <p className="mt-2 text-slate-500">
          You are signed in as{" "}
          <span className="font-medium text-slate-700">
            {role}
          </span>
          .
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Customers</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Projects</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Tasks</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Revenue</p>
            <p className="mt-2 text-3xl font-bold">₹0</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;