import { Component, Input } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";

@Component({
  selector: 'app-eventos',
  imports: [HeroComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent {
  // Estas son las variables que "escuchan" lo que envías desde el padre
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '90vh';
}
