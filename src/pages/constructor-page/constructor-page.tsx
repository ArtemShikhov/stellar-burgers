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