import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE FINALIZADOR RESETEO CONTRASEÑA ###### */
// ------ Obtiene Parametros Url Referentes A Email Enviado Y Posibilita Mutacion Opcional ------
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HeroComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  
  /* ###### ATRIBUTOS RECIBIDOS O MODIFICABLES ###### */

  // ------ Codigo Excepcional Validado Por Spring Boot Jwt ------
  token: string = '';
  // ------ String Primario Guardable ------
  newPassword: string = '';
  // ------ String De Seguridad Comparativo ------
  confirmPassword: string = '';

  /* ###### INDICADORES DE VISTA ###### */

  // ------ Bandera Renderizado ------
  loading: boolean = false;
  // ------ Error General ------
  errorMessage: string = '';
  // ------ Confirmacion Http Al Frontend ------
  mensajeSuccess: string = '';

  /* ###### CONSTRUCTOR PRINCIPAL ###### */

  // ------ Precisa Router Para Viajar En App Y Activated Para Leer Urls Parametrizadas ------
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  /* ###### CAPTURA DE PARAMETROS AL INICIAR ###### */

  // ------ Engancha Parametro Antes Que Pantalla Y Revisa Si Resulta Valido ------
  ngOnInit(): void {
    // ------ Extraemos El Token De Los Parametros De Consulta (?token=...) ------
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // ------ Cierra La Posiblidad Si Fue Una Manipulacion O Copia Inexistente ------
    if (!this.token) {
      this.errorMessage =
        'El enlace de recuperación no es válido o ha expirado.';
    }
  }

  /* ###### DISPARADOR DE CAMBIO (PUT POST) ###### */

  // ------ Envoltorio A Consumo De Observables Segun Comparativa Angular ------
  actualizarPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // ------ Metodo Con Token Incluido ------
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.mensajeSuccess =
          'Contraseña actualizada correctamente. Redirigiendo al login...';
        // ------ Auto Login Salto Tras Tres Segundos Mensaje ------
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.loading = false;
        // ------ Devuelve Fallos Especificos Como Caducidad Por Suelo Rest ------
        this.errorMessage =
          err.error?.message ||
          'Error al restablecer la contraseña. El enlace puede haber caducado.';
      },
    });
  }
}
