import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EventoDetalleComponent } from './components/evento-detalle/evento-detalle.component';
import { MisEntradasComponent } from './components/mis-entradas/mis-entradas.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'evento/:id', component: EventoDetalleComponent },
  { path: 'mis-compras', component: MisEntradasComponent },
  { path: 'detalle-compra/:id', component: DetalleCompraComponent },
  { path: 'categoria/:categoria', component: EventosComponent }, // Ruta para categorías
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: 'register', component: RegistroComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'perfil', component: MiCuentaComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
];
