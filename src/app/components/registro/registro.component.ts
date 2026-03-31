import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  // Coincide con la lógica de UsuarioService.crearNuevoUsuario
  user = {
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  showPassword = false;
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    // 1. Validación manual de contraseñas
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // 2. Limpieza del objeto: eliminamos confirmPassword para que coincida con el DTO de Java
    const { confirmPassword, ...dataToSubmit } = this.user;

    // 3. Llamada al servicio
    this.authService.register(dataToSubmit).subscribe({
      next: (res) => {
        this.loading = false;
        // 'res.message' ahora es accesible porque la API devuelve un JSON
        console.log('Respuesta del servidor:', res.message);

        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (err) => {
        this.loading = false;

        // Manejo de errores basado en tu GlovaRestExcepionHandler
        if (typeof err.error === 'string') {
          // Captura los mensajes de ConflictoException, etc.
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage =
            'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
      },
    });
  }
}
