import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './Layout';

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  // If not authenticated, redirect to login with the current path as redirect target
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // If authenticated, render the child routes inside the Layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default ProtectedRoute;