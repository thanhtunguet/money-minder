
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to handle redirect after authentication is complete
  useEffect(() => {
    // If we have a user and we're not loading, make sure we don't redirect away
    if (user && !loading && location.pathname === "/auth") {
      navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated and we're not on the auth page, redirect to auth
  if (!user && location.pathname !== "/auth") {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
