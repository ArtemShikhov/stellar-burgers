import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectProfileOrders } from '@selectors';
import { fetchProfileOrders } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
    const interval = setInterval(() => dispatch(fetchProfileOrders()), 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
