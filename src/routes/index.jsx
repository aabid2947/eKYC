import { Routes, Route } from 'react-router-dom';
import { protectedAdminRoutes } from './ProtectedAdminRoutes';
import { protectedUserRoutes } from './ProtectedUserRoute';
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from './ProtectedRoutes';
import {PublicRoute,publicRoutes} from './PublicRoutes';

const AppRoutes = () => {
 
  return (
    <Routes>
 
      {/* Not accessible to logged-in users */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map((route, idx) => (
          <Route key={`public-${idx}`} path={route.path} element={route.element} />
        ))}
      </Route>


      {/* Accessible to logged-in users with roles 'user' or 'admin' */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
        {protectedUserRoutes.map((route, idx) => (
          <Route key={`user-${idx}`} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Accessible only to logged-in users with the 'admin' role */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        {protectedAdminRoutes.map((route, idx) => (
          <Route key={`admin-${idx}`} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Fallback Routes */}
      <Route path="/unauthorized" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;