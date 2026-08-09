import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { RootState } from '../../services/store'; // Импорт типизированного хука из вашего store

type ProtectedRouteProps = {
  children: ReactElement;
};

// Предполагается, что состояние авторизации будет в store.state.user
// Примерная структура: { isAuthChecked: boolean, user: object | null }
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  // Получаем состояние авторизации из Redux
  const isAuthChecked = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const user = useSelector((state: RootState) => state.user.user);

  // Если проверка авторизации еще не завершена, можно вернуть лоадер
  // if (!isAuthChecked) {
  //   return <Preloader />; // или другой компонент загрузки
  // }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    // Сохраняем предыдущий маршрут, чтобы вернуться после успешного входа
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если пользователь авторизован, отображаем дочерние элементы
  return children;
};
