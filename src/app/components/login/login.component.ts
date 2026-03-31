import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeroComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh';


  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loading = false; // Nueva variable
  showPassword = false;

  onSubmit() {
    this.loading = true; // Bloqueamos el botón
    this.errorMessage = ''; // Limpiamos errores previos

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.notifyLoginSuccess(this.credentials.username);
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        this.loading = false; // Liberamos el botón para reintentar
        this.errorMessage = 'Usuario o contraseña incorrectos';
      },
      complete: () => (this.loading = false),
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
