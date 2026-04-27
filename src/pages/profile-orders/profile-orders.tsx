import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getOrdersThunk } from '../../services/order/order-slice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.history.orders
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
