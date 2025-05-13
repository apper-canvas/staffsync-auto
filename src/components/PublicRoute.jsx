import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute() {
  const { isAuthenticated } = useSelector((state) => state.user);

  // If already authenticated and trying to access public routes like login or signup,
  // redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default PublicRoute;