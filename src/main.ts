import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/* ###### FUNCION ARRANQUE APLICACION ###### */

// ------ Despliegue Principal Del Bootstrapper Que Instancia O Frena Toda La App ------
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
