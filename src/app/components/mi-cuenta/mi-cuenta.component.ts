import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from '../hero/hero.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule, FormsModule, HeroComponent, RouterModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css',
})
export class MiCuentaComponent implements OnInit {
  // -----------------------------
  // PROPIEDADES DEL COMPONENTE
  // -----------------------------

  /** Datos del usuario obtenidos del backend */
  usuario: any = {};

  /** Campos para el cambio de contraseña */
  passwordActual: string = '';
  passwordNueva: string = '';

  /** Estado de carga y mensajes */
  loading: boolean = false;
  mensaje: string = '';

  /** Inputs opcionales para el hero */
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // -----------------------------
  // CICLO DE VIDA
  // -----------------------------

  /**
   * Al iniciar el componente, obtenemos el perfil del usuario.
   */
  ngOnInit(): void {
    this.cargarPerfil();
  }

  // -----------------------------
  // MÉTODOS PRINCIPALES
  // -----------------------------

  /**
   * Obtiene los datos del perfil desde el backend
   * y normaliza los campos para evitar undefined en el HTML.
   */
  private cargarPerfil(): void {
    this.authService.getPerfil().subscribe((res) => {
      this.usuario = res;

      // Normalización de campos (evita errores en el HTML)
      this.usuario.metodoPagoPreferido =
        res.metodoPagoPref || res.metodoPagoPreferido || '';

      this.usuario.calle = res.calle || '';
      this.usuario.numero = res.numero || '';
      this.usuario.pisoPuerta = res.pisoPuerta || '';
      this.usuario.codigoPostal = res.codigoPostal || '';
      this.usuario.ciudad = res.ciudad || '';
      this.usuario.provincia = res.provincia || '';
      this.usuario.pais = res.pais || '';
    });
  }

  /**
   * Envía la solicitud para cambiar la contraseña del usuario.
   */
  cambiarPassword(): void {
    this.loading = true;

    this.authService
      .updatePassword( this.passwordNueva)
      .subscribe({
        next: () => {
          this.mensaje = 'Contraseña actualizada con éxito';
          this.loading = false;

          // Limpiamos los campos del formulario
          this.passwordActual = '';
          this.passwordNueva = '';
        },
        error: () => {
          this.mensaje = 'La contraseña actual no es correcta';
          this.loading = false;
        },
      });
  }

  /**
   * Navega al formulario de edición del perfil.
   */
  irAEditar(): void {
    this.router.navigate(['/editar-perfil']);
  }

  /**
   * Abre el modal de cambio de contraseña (si lo implementas).
   */
  abrirModalPassword(): void {
    console.log('Abriendo modal de cambio de contraseña...');
  }
}
