import { HttpInterceptorFn } from '@angular/common/http';

/* ###### INTERCEPTOR DE PETICIONES HTTP ###### */
// ------ Funcion Fundamental Que Se Mete En Todo Trafico Saliente Agregando Un Token Si Existe ------
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  /* ###### VERIFICACION EN ALMACENAMIENTO ###### */

  // ------ Intentamos Recuperar El Token Del Almacenamiento Local ------
  const token = localStorage.getItem('token');

  /* ###### CLONADOR DE SEGURIDAD ###### */

  // ------ Si El Token Existe Clonamos La Peticion Y Le Añadimos La Cabecera Bearer ------
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  /* ###### LIBERACION Y CONTINUACION ###### */

  // ------ Si No Hay Token La Peticion Sigue Su Curso Normal Como Flujo Rutinario ------
  return next(req);
};