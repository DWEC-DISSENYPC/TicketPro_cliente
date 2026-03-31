import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from "../hero/hero.component";
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule, FormsModule, HeroComponent, RouterModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css',
})
export class MiCuentaComponent implements OnInit {
  usuario: any = {}; // Aquí guardaremos los datos que vengan del backend
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
    // Aquí llamarías a un método de tu servicio para obtener los datos del perfil
    this.authService.getPerfil().subscribe((res) => {
      this.usuario = res;
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

  // 1. Función para navegar a la edición del perfil
  irAEditar() {
    console.log('Navegando a la edición del perfil...');
    this.router.navigate(['/editar-perfil']);
  }

  abrirModalPassword() {
    console.log('Abriendo modal de cambio de contraseña...');
    // Aquí activarías una variable booleana para mostrar un popup
  }
}
