import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // ------ Importante Para Style Y Otros ------
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/* ###### COMPONENTE HERO REUTILIZABLE ###### */
// ------ Genera Portadas Destacadas Muy Configurables Por Sus Inyecciones ------
@Component({
  selector: 'app-hero',
  standalone: true, // ------ Esto Lo Hace Independiente ------
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  
  /* ###### PARAMETROS DE ENTRADA EXPORTADOS ###### */

  // ------ Frase Mayor En Negrita Que Encabeza ------
  @Input() titulo: string = '';
  // ------ Parrafo Explicativo Que Cierra Idea ------
  @Input() subtitulo: string = '';
  // ------ Enlace Referencial Fotografico ------
  @Input() imagenFondo: string = '';
  // ------ Tamaño Maximo Reservado En Formato Vw O Vh O Px - Por Defecto 90 Para Home ------
  // ------ Tamaño Maximo Reservado En Formato Vw O Vh O Px - Por Defecto 90 Para Home ------
  @Input() altura: string = '90vh'; 

  /* ###### ESTADOS DEL COMPONENTE ###### */

  // ------ Controla La Visibilidad Del Popup De Busqueda ------
  mostrarBuscador: boolean = false;
  // ------ Termino De Busqueda Vinculado Al Input ------
  terminoBusqueda: string = '';

  constructor(private router: Router) {}

  /* ###### METODOS DE ACCION ###### */

  // ------ Abre El Modal De Busqueda ------
  abrirBuscador(): void {
    this.mostrarBuscador = true;
    this.terminoBusqueda = '';
  }

  // ------ Cierra El Modal De Busqueda ------
  cerrarBuscador(): void {
    this.mostrarBuscador = false;
  }

  // ------ Navega A La Pagina De Eventos Con El Filtro Aplicado ------
  ejecutarBusqueda(): void {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/eventos'], { queryParams: { search: this.terminoBusqueda } });
      this.cerrarBuscador();
    }
  }

  // ------ Navega Directamente A La Cartelera ------
  explorarCartelera(): void {
    this.router.navigate(['/eventos']);
  }
}
