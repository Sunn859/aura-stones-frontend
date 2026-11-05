import { Navigate, Outlet } from "react-router";
import useAuthStore from "../stores/authStore";

function RequireAuth() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;