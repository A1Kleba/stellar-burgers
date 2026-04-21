import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { selectIsAuth } from '../../services/user/user-slice';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthInit = useSelector(selectIsAuth);
  const location = useLocation();

  if (isAuthInit === undefined) {
    return <div>Loading...</div>;
  }
  if (onlyUnAuth && isAuthInit) {
    return <Navigate replace to='/' />;
  }
  if (!onlyUnAuth && !isAuthInit) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
