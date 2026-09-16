function Dashboard() {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your business operations.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Customers</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Projects</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₹0</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
