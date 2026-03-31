import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'eventos', component: EventosComponent }, // Crea un componente vacío por ahora
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: 'register', component: RegistroComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'perfil', component: MiCuentaComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
];
