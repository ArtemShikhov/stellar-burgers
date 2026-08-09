<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем hooks
import { fetchIngredients, selectItems } from '../../services/slices/ingredientsSlice'; // Импортируем экшн и селектор
import { AppDispatch, RootState } from '../../services/store'; // Импортируем типы
import { BurgerIngredients } from '../../components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '../../components/burger-constructor/burger-constructor';
import { Preloader } from '../../components/ui/preloader/preloader';
import styles from './constructor-page.module.css';

export const ConstructorPage = () => {
  const dispatch: AppDispatch = useDispatch(); // Получаем типизированный dispatch
  const ingredients = useSelector(selectItems); // Получаем ингредиенты через селектор

  useEffect(() => {
    // Вызываем экшн для загрузки ингредиентов при монтировании компонента
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Получаем состояние загрузки из стора
  const loading = useSelector((state: RootState) => state.ingredients.loading);

  if (loading) return <Preloader />;

  return (
    <div className={styles.container}>
      <div className={styles.burgerIngredients}>
        <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
        {/* Рендерим BurgerIngredients без пропсов, он сам берёт данные из стора */}
        <BurgerIngredients />
        {/* Временный fallback, если ингредиентов нет */}
        {!ingredients.length && <p>Нет ингредиентов</p>}
      </div>
      <div className={styles.burgerConstructor}>
        <h1 className="text text_type_main-large mb-5">&nbsp;</h1>{/* Пустой заголовок для отступа */}
        <BurgerConstructor />
      </div>
    </div>
  );
};
=======
import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => (
  <main className={styles.containerMain}>
    <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
      Соберите бургер
    </h1>
    <div className={`${styles.main} pl-5 pr-5`}>
      <BurgerIngredients />
      <BurgerConstructor />
    </div>
  </main>
);
>>>>>>> 491ec180fb55cb0b9b556214cef1ba9dca534cc6
