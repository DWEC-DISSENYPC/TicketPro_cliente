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
  usuario: any = {};
  passwordActual: string = '';
  passwordNueva: string = '';
  loading: boolean = false;
  mensaje: string = '';

  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getPerfil().subscribe((res) => {
      this.usuario = res;

      // Normalizamos los campos para evitar undefined en el HTML
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

  cambiarPassword() {
    this.loading = true;
    this.authService
      .updatePassword(this.passwordActual, this.passwordNueva)
      .subscribe({
        next: () => {
          this.mensaje = 'Contraseña actualizada con éxito';
          this.loading = false;
          this.passwordActual = '';
          this.passwordNueva = '';
        },
        error: () => {
          this.mensaje = 'La contraseña actual no es correcta';
          this.loading = false;
        },
      });
  }

  irAEditar() {
    this.router.navigate(['/editar-perfil']);
  }

  abrirModalPassword() {
    console.log('Abriendo modal de cambio de contraseña...');
  }
}
