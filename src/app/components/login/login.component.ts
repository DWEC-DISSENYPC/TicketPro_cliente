import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE DE IDENTIFICACION Y ACCESO ###### */
// ------ Genera La Interaccion Directa Para Obtener Un Jwt Valido Tras Autenticar ------
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  
  /* ###### ATRIBUTOS INTERNOS DEL FORMULARIO ###### */

  // ------ Estructura De Datos Recolectada En Caja ------
  credentials = { username: '', password: '' };
  // ------ Error Propagado A La Vista ------
  errorMessage = '';

  /* ###### PARAMETROS DE ENTRADA HERO COMPARTIDO ###### */

  // ------ Frase Mayor En Negrita Que Encabeza ------
  @Input() titulo: string = '';
  // ------ Parrafo Explicativo Que Cierra Idea ------
  @Input() subtitulo: string = '';
  // ------ Enlace Referencial Fotografico ------
  @Input() imagenFondo: string = '';
  // ------ Tamaño Maximo Reservado En Formato Vw O Vh O Px - Por Defecto 90 Para Home ------
  @Input() altura: string = '90vh';

  /* ###### CONSTRUCTOR PRINCIPAL ###### */

  // ------ Despliega Las Instancias Rest Para Llamados Servidor Y El Enrutador ------
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /* ###### INDICADORES VISUALES DE AYUDA ###### */

  // ------ Detonador De Elemento Bloqueante Cargando ------
  loading = false; 
  // ------ Bandera Que Alterna Text O Password En El Html ------
  showPassword = false;

  /* ###### METODO PRINCIPAL DE SUBMIT ###### */

  // ------ Detonacion Comun Que Empaqueta Y Remite Al Guard Rest ------
  onSubmit() {
    // ------ Bloqueamos El Boton ------
    this.loading = true; 
    // ------ Limpiamos Errores Previos ------
    this.errorMessage = ''; 

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.notifyLoginSuccess(this.credentials.username);
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        // ------ Liberamos El Boton Para Reintentar ------
        this.loading = false; 
        this.errorMessage = 'Usuario o contraseña incorrectos';
      },
      complete: () => (this.loading = false),
    });
  }

  /* ###### UTILIDADES Y FUNCIONES ADICIONES ###### */

  // ------ Permite Ejecutar Desde Vista El Alternador Del Ojo Contraseña ------
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
