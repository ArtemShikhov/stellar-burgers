import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'; // Добавлен useNavigate
import { Provider, useSelector } from 'react-redux'; // Импортируем Provider и useSelector
import { store, RootState } from '../../services/store'; // Импортируем store и RootState
import { ConstructorPage } from '../../pages/constructor-page';
import '../../index.module.css';
import styles from './app.module.css';

import { AppHeader } from '../app-header/app-header';
import { Preloader } from '../ui/preloader/preloader'; // Исправлен путь к Preloader
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { Feed } from '../../pages/feed';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404'; // Исправлено имя папки
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { ProtectedRoute } from '../protected-route/protected-route'; // Импорт защищенного маршрута

// Компонент для условной отрисовки модального окна
const AppWithModal = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Добавлен хук navigate
  const backgroundLocation = location.state?.background;

  return (
    <>
      <AppHeader />
      {/* Основной маршрут */}
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {/* Защищенные маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальное окно поверх основного маршрута */}
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                {' '}
                {/* Добавлен onClose */}
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                {' '}
                {/* Добавлен onClose */}
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                {' '}
                {/* Добавлен onClose */}
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

// Внутренний компонент App, который использует данные из стора
const AppContent = () => {
  // Используем useSelector для получения состояния из Redux
  const { items: ingredients, loading: isIngredientsLoading, error } = useSelector((state: RootState) => state.ingredients);

  return (
    <div className={styles.app}>
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <AppWithModal />
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

// Основной компонент App, оборачивающий всё приложение в Provider
const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;