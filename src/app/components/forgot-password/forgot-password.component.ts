import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE DE RECUPERACION DE CLAVE ###### */
// ------ Expone Pantalla Visual Simple Interconectada Para Envios De Correos ------
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HeroComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  
  /* ###### ESTADOS BINDED DEL FORMULARIO ###### */

  // ------ Guarda Input Bi Direccional Del Html ------
  email: string = '';
  // ------ Notificador Render De Exito Http ------
  mensajeSuccess: string = '';
  // ------ Error Propagado A La Vista ------
  errorMessage: string = '';
  // ------ Bloqueador Visual En Uso ------
  loading: boolean = false;

  /* ###### CONSTRUCTOR PRINCIPAL ###### */

  // ------ Inyecta Exclusivamente El Gestor Central De Usuarios ------
  // ------ Solo Se Declara Aqui Dentro Del Constructor ------
  constructor(private authService: AuthService) {}

  /* ###### DETONADOR HTTP DE ENLACE ###### */

  // ------ Consumo Del Metodo Asincrono Pasando Email Activo ------
  enviarEnlace() {
    this.loading = true;
    this.errorMessage = '';
    this.mensajeSuccess = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        // ------ El Codigo Esperara Aqui El Tiempo Que Hemos Definido En Java ------
        this.mensajeSuccess = res.message;
        this.loading = false;
        this.email = '';
      },
      error: (err: any) => {
        // ------ Solo En Caso De Error Real De Conexion ------
        this.errorMessage = 'Servicio temporalmente no disponible.';
        this.loading = false;
      },
    });
  }
}
