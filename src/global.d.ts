import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
  interface RefAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void;
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void;
  }
}
<<<<<<< HEAD

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
=======
>>>>>>> 491ec180fb55cb0b9b556214cef1ba9dca534cc6
