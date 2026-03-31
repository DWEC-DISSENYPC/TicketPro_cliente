import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  mensajeSuccess: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Extraemos el token de los parámetros de consulta (?token=...)
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.errorMessage =
        'El enlace de recuperación no es válido o ha expirado.';
    }
  }

  actualizarPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.mensajeSuccess =
          'Contraseña actualizada correctamente. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          'Error al restablecer la contraseña. El enlace puede haber caducado.';
      },
    });
  }
}
