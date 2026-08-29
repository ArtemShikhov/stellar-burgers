import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Пока модалка открыта, страница за оверлеем полностью заблокирована:
  // нельзя проскроллить фон и нельзя кликнуть по элементам под оверлеем
  // (например, открыть второе модальное окно поверх первого).
  useEffect(() => {
    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    const previousPointerEvents = root?.style.pointerEvents ?? '';

    document.body.style.overflow = 'hidden';
    if (root) root.style.pointerEvents = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (root) root.style.pointerEvents = previousPointerEvents;
    };
  }, []);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
