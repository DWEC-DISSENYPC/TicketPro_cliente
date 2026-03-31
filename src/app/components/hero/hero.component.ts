import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para [style] y otros

@Component({
  selector: 'app-hero',
  standalone: true, // <--- Esto lo hace independiente
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh'; // Valor por defecto para la Home
}
