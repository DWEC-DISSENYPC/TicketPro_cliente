import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa esto
import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor'; // Importa tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor]) // Aquí registramos el interceptor
    )
  ]
};
