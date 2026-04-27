import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import {
  selectIsAuth,
  selectIsAuthChecked
} from '../../services/user/user-slice';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate replace to='/' />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
