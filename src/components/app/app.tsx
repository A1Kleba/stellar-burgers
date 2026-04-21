import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import styles from './app.module.css';
import { useEffect } from 'react';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { useDispatch, RootState, useSelector } from '../../services/store';
import { useLocation, useMatch, useNavigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getIngredients } from '../../services/ingredients/ingredients-slice';
import { getUserThunk } from '../../services/user/actions';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const profileOrderId = useMatch('/profile/orders/:number')?.params.number || null;
  const feedId = useMatch('/feed/:number')?.params.number || null;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUserThunk());
  }, []);

  const isIngredientsLoading = useSelector((state: RootState) => state.ingredients.isLoading);
  const ingredients = useSelector((state: RootState) => state.ingredients.ingredients);
  const error = null;

  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route path={'/'} element={<AppHeader />}>
          <Route
            path={'/'}
            element={
              isIngredientsLoading ? (
                <Preloader />
              ) : error ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {error}
                </div>
              ) : ingredients.length > 0 ? (
                <ConstructorPage />
              ) : (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Нет игредиентов
                </div>
              )
            }
          />
          <Route path={'/feed'} element={<Feed />} />
          <Route
            path={'/login'}
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/register'}
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/forgot-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/reset-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile'}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile/orders'}
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path={'*'} element={<NotFound404 />} />
          <Route path={'/feed/:number'} element={<OrderInfo />} />
          <Route path={'/ingredients/:id'} element={<IngredientDetails />} />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route
            path={'/feed/:number'}
            element={
              <Modal
                title={`#${feedId}`}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${profileOrderId}`}
                  onClose={function (): void {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
