import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/* ###### INTERCEPTOR DE ERRORES HTTP ###### */
// ------ Detecta Respuestas Fallidas Y Actua En Consecuencia (Ej. Sesion Expirada) ------
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      /* ###### CONTROL DE ACCESO DENEGADO ###### */
      
      // ------ Si Recibimos Un 401 O 403 El Token Probablemente No Es Valido ------
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión inválida o expirada detectada por el interceptor.');
        authService.logout();
        
        // ------ Podriamos Redirigir Al Login Aqui Si Quisieramos Forzar ------
        // window.location.href = '/login'; 
      }

      return throwError(() => error);
    })
  );
};
