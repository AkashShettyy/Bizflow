import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

function ProtectedRoute() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;