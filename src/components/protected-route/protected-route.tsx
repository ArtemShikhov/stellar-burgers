import { FC, ReactElement } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectIsAuthenticated } from '@selectors';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from ?? '/'} replace />;
  }

  return children;
};
