import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';
  mensajeSuccess: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // Solo se declara AQUÍ, dentro del constructor.
  constructor(private authService: AuthService) {}

  enviarEnlace() {
    this.loading = true;
    this.errorMessage = '';
    this.mensajeSuccess = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        // El código esperará aquí el tiempo que hemos definido en Java
        this.mensajeSuccess = res.message;
        this.loading = false;
        this.email = '';
      },
      error: (err: any) => {
        // Solo en caso de error real de conexión
        this.errorMessage = 'Servicio temporalmente no disponible.';
        this.loading = false;
      },
    });
  }
}
