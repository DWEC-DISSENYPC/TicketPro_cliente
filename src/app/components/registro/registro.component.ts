import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { AuthService } from '../../services/auth.service';

/* ###### COMPONENTE DE REGISTRO E INCORPORACION ###### */
// ------ Expone La UI Publica Que Pide Requisitos A Usuarios Y Despacha Nuevo Auth Al Back ------
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  
  /* ###### OBJETO MODELO DE ALMACENAMIENTO ###### */

  // ------ Coincide Con La Logica De UsuarioService.crearNuevoUsuario ------
  user = {
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  /* ###### INDICADORES VISUALES COMPLEMENTARIOS ###### */

  // ------ Gestores Activos Frontales ------
  showPassword = false;
  errorMessage = '';
  loading = false;

  /* ###### CONSTRUCTOR CENTRAL ###### */

  // ------ Establece Autentificacion Y Control Redireccional ------
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /* ###### ALTERNADOR DE CONTRASTRASENAS FRONT ###### */

  // ------ Habilita Texto Simple Sobre El Output Puntillado ------
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /* ###### METODO CENTRAL DE EJECUCION POST ###### */

  // ------ Metodo Disparador Ligado Al Submit Del NgForm ------
  onRegister() {
    // ------ 1. Validacion Manual De Contraseñas Previas A Gasto Http ------
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // ------ 2. Limpieza Y Bloqueo ------  
    this.loading = true;
    this.errorMessage = '';

    // ------ 3. Limpieza Del Objeto Eliminamos ConfirmPassword Para Que Coincida Con El DTO De Java ------
    const { confirmPassword, ...dataToSubmit } = this.user;

    // ------ 4. Llamada Al Servicio Observado ------
    this.authService.register(dataToSubmit).subscribe({
      next: (res) => {
        this.loading = false;
        // ------ Res.message Ahora Es Accesible Porque La API Devuelve Un JSON ------
        console.log('Respuesta del servidor:', res.message);

        // ------ Viaje Hacia Modulo De Accesso Normal Mandando Señuelos Por Url ------
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (err) => {
        // ------ Desbloqueo ------
        this.loading = false;

        // ------ Manejo De Errores Basado En Tu GlovaRestExcepionHandler ------
        if (typeof err.error === 'string') {
          // ------ Captura Los Mensajes De ConflictoException Etc ------
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          // ------ Excepcion Inecontrolada Fallback ------
          this.errorMessage =
            'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
      },
    });
  }
}
