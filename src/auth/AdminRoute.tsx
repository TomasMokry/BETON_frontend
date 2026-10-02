import { Navigate } from "react-router-dom";
import { SpinnerLoading } from "../layouts/utils/SpinnerLoading";
import { useAuth } from "./AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

/** Like PrivateRoute, but only for users with the ADMIN role; others go to the shop. */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, initialized, user } = useAuth();

  if (!initialized) {
    return <SpinnerLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};
