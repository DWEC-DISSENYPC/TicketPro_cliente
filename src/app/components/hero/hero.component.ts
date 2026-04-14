import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // ------ Importante Para Style Y Otros ------

/* ###### COMPONENTE HERO REUTILIZABLE ###### */
// ------ Genera Portadas Destacadas Muy Configurables Por Sus Inyecciones ------
@Component({
  selector: 'app-hero',
  standalone: true, // ------ Esto Lo Hace Independiente ------
  imports: [CommonModule],
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
  @Input() altura: string = '90vh'; 
}
