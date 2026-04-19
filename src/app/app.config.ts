import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

/* ###### CONFIGURADOR MAESTRO ANGULAR VARIABLES FRONT ###### */

// ------ Exporta La Inyeccion De Dependencias Absolutas Como Http Y Rutas ------
export const appConfig: ApplicationConfig = {
  providers: [
    
    // ------ Facilita Opciones De Carga Direcciones ------
    provideRouter(routes),
    
    // ------ Establece El Cliente Nativo De Consultas Web Y Adhiere Su Middleware ------
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    )
  ]
};
