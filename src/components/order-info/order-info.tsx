import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectProfileOrders,
  selectOrderModalData,
  selectOrderByNumber,
  selectIngredientsItems
} from '@selectors';
import { fetchOrderByNumber } from '@slices';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const dispatch = useDispatch();

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const orderModalData = useSelector(selectOrderModalData);
  const fetchedOrder = useSelector(selectOrderByNumber);
  const ingredients: TIngredient[] = useSelector(selectIngredientsItems);

  const orderData = useMemo(
    () =>
      [...feedOrders, ...profileOrders, orderModalData, fetchedOrder].find(
        (order) => order && order.number === orderNumber
      ) ?? null,
    [feedOrders, profileOrders, orderModalData, fetchedOrder, orderNumber]
  );

  useEffect(() => {
    if (!orderData && orderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [orderData, orderNumber, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
