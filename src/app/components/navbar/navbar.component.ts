import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventoService } from '../../services/evento.service';

/* ###### COMPONENTE NAVBAR ENRUTADOR SUPREMO ###### */
// ------ Fija Las Opciones Rapidas De Salto Hacia Diferentes Instancias Del Arbol Visual Component ------
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  
  /* ###### PARAMETROS TOAST ALERTA ###### */

  // ------ Variables Encuestas Sobre Interfaz De Notificacion Flotante ------
  showToast = false;
  toastMessage = '';
  // ------ Condicional Restriccion Entre Dos Colores Success O Info ------
  toastType = 'success'; 

  /* ###### PARAMETROS MENU CENTRAL ###### */

  // ------ Estado Del Hamburguesa Movil ------
  isMenuOpen = false;
  // ------ Matriz Rellena Mediante Consulta Global Pre Configurada ------
  categorias: string[] = [];
  cargandoCategorias = false;

  /* ###### CONSTRUCTOR CENTRALIZADO ###### */

  // ------ Provee Ambos Servicios Indistintamente Operancia Total ------
  constructor(
    public authService: AuthService,
    private router: Router,
    private eventoService: EventoService
  ) {}

  /* ###### LOGICA INTERRUPTOR ###### */

  // ------ Boton Movil Toggle Hamburguesa ------
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /* ###### INICIADOR Y SUSCRIPCIONES ###### */

  // ------ Promesas Adscritas Permanentes De Atencion Ante Variantes Centralizadas ------
  ngOnInit() {
    // ------ Escuchamos Cuando El Servicio Diga Que Alguien Se Ha Logueado ------
    this.authService.loginSuccess$.subscribe((username) => {
      this.launchToast(`¡Bienvenido de nuevo, ${username}!`, 'success');
    });

    // ------ Iniciador Temprano Renderizado Categoria ------
    this.cargarCategorias();
  }

  /* ###### FUNCIONES COMPARTIDAS HTTP Y GETTERS ###### */

  // ------ Asigna Carga Al Menu Dinamico Consultando Genericos Backend ------
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
        // ------ En Caso De Error Mostrar Categorias Por Defecto Hardcoded ------
        this.categorias = ['Conciertos', 'Teatro', 'Deportes'];
      }
    });
  }

  /* ###### REGENERADOR VISUAL TOAST ALERT ###### */

  // ------ Creamos Un Metodo Para Disparar El Aviso Cronomotrizado Despue De Tiempo ------
  launchToast(message: string, type: 'success' | 'info' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // ------ Se Oculta Automaticamente Tras Vencimiento Delay ------
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  /* ###### CERRADO SESION LOGOUT ###### */

  // ------ Vacuna Variables Removidas Storage Local Y Genera Notificancia ------
  onLogout(): void {
    this.authService.logout();
    this.launchToast('Sesión cerrada correctamente', 'info'); // ------ Lanzamos El Aviso ------
    this.router.navigate(['/eventos']);
  }
}
