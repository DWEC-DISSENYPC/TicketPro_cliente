import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos recuperar el token del almacenamiento local
  const token = localStorage.getItem('token');

  // 2. Si el token existe, clonamos la petición y le añadimos la cabecera
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 3. Si no hay token, la petición sigue su curso normal
  return next(req);
};