import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HeroComponent } from '../hero/hero.component';
import { RouterModule, Router } from '@angular/router';

/* ###### COMPONENTE DE MI CUENTA GENERAL ###### */
// ------ Representa La Vista Personal Resumida De Todo El Objeto Logueado ------
@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule, FormsModule, HeroComponent, RouterModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrl: './mi-cuenta.component.css',
})
export class MiCuentaComponent implements OnInit {

  /* ###### PROPIEDADES ESTANDARDS DE COMPONENTE ###### */

  // ------ Objeto Principal Recolectado Del Backend Central ------
  usuario: any = {};
  
  // ------ Enunciados Variables Para Posible Update ------
  passwordActual: string = '';
  passwordNueva: string = '';

  // ------ Renderizadores Textuales Temporales E Inhabilitadores ------
  loading: boolean = false;
  mensaje: string = '';

  /* ###### PROPIEDADES ENVIADAS AL HERO ###### */

  // ------ Permisos Inputs Para Modificar Decorado Frontal ------
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh';

  /* ###### CONSTRUCTOR BASICO ###### */

  // ------ Asienta Instancias Autenticacion Y El Redireccionador Ruta ------
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /* ###### CICLO DE CARGA INICIAL ###### */

  // ------ Arranca Tras Montar Buscando Un Get Seguro ------
  ngOnInit(): void {
    this.cargarPerfil();
  }

  /* ###### EXTRACCION DE SEGURIDAD RELACIONAL ###### */

  // ------ Obtiene Los Datos Rest Y Normaliza Su Mapeado Impidiendo Undefined Html ------
  private cargarPerfil(): void {
    this.authService.getPerfil().subscribe((res) => {
      this.usuario = res;

      // ------ Normalizacion Forzada Contra Atributos Incompletos O Nulos ------
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

  /* ###### ACTUALIZACION DE ATRIBUTO SEGURIDAD ###### */

  // ------ Generador Post Exclusivo Y Oculto Para Modificar La Clave Temporalmente ------
  cambiarPassword(): void {
    this.loading = true;

    this.authService
      .updatePassword(this.passwordNueva)
      .subscribe({
        next: () => {
          this.mensaje = 'Contraseña actualizada con éxito';
          this.loading = false;

          // ------ Limpiamiento Expreso Al Lograr Cometido ------
          this.passwordActual = '';
          this.passwordNueva = '';
        },
        error: () => {
          this.mensaje = 'La contraseña actual no es correcta';
          this.loading = false;
        },
      });
  }

  /* ###### RUTAS DEPENDIENTES ###### */

  // ------ Salto Desviado Al Editor Rest ------
  irAEditar(): void {
    this.router.navigate(['/editar-perfil']);
  }

  /* ###### VENTANAS GLOBALES EXTERNAS ###### */

  // ------ Disparador Ciego Por Si Se Aplica Una Vista Previa Superpuesta ------
  abrirModalPassword(): void {
    console.log('Abriendo modal de cambio de contraseña...');
  }
}
