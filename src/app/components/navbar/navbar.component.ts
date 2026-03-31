import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  showToast = false;
  toastMessage = '';
  toastType = 'success'; // Puede ser 'success' o 'info'

  ngOnInit() {
    // Escuchamos cuando el servicio diga que alguien se ha logueado
    this.authService.loginSuccess$.subscribe((username) => {
      this.launchToast(`¡Bienvenido de nuevo, ${username}!`, 'success');
    });
  }

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  // Creamos un método para disparar el aviso
  launchToast(message: string, type: 'success' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Se oculta automáticamente tras 3 segundos
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onLogout(): void {
    this.authService.logout();
    this.launchToast('Sesión cerrada correctamente', 'info'); // Lanzamos el aviso
    this.router.navigate(['/eventos']);
  }
}
