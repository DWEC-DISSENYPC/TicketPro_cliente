import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showToast = false;
  toastMessage = '';
  toastType = 'success'; // Puede ser 'success' o 'info'

  isMenuOpen = false;
  categorias: string[] = [];
  cargandoCategorias = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private eventoService: EventoService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    // Escuchamos cuando el servicio diga que alguien se ha logueado
    this.authService.loginSuccess$.subscribe((username) => {
      this.launchToast(`¡Bienvenido de nuevo, ${username}!`, 'success');
    });

    // Cargar categorías de eventos
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.eventoService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargandoCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.cargandoCategorias = false;
        // En caso de error, mostrar categorías por defecto
        this.categorias = ['Conciertos', 'Teatro', 'Deportes'];
      }
    });
  }

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
