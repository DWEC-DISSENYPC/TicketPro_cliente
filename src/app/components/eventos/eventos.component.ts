import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { EventoService } from '../../services/evento.service';
import { EventoDTO } from '../../models/evento.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-eventos',
  imports: [HeroComponent, CommonModule, RouterModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit, OnDestroy {
  // Propiedades del Hero
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '70vh';

  // Propiedades de eventos
  eventos: EventoDTO[] = [];
  eventosFiltrados: EventoDTO[] = [];
  cargando: boolean = false;
  error: string | null = null;
  cantidadEventos: number = 8;

  // Propiedades de categoría
  categoriaActual: string | null = null;
  private routeSub: Subscription = new Subscription();

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en los parámetros de la ruta
    this.routeSub = this.route.params.subscribe(params => {
      this.categoriaActual = params['categoria'] || null;
      this.cargarEventos();
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  cargarEventos(): void {
    this.cargando = true;
    this.error = null;

    if (this.categoriaActual) {
      // Si hay una categoría seleccionada, obtener todos los eventos y filtrar
      this.eventoService.listarTodos().subscribe({
        next: (todosLosEventos) => {
          this.eventos = todosLosEventos;
          this.filtrarEventosPorCategoria();
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar eventos:', err);
          this.error = 'No se pudieron cargar los eventos. Intenta más tarde.';
          this.cargando = false;
        },
      });
    } else {
      // Si no hay categoría, mostrar eventos aleatorios
      this.eventoService.obtenerEventosAleatorios(this.cantidadEventos).subscribe({
        next: (data) => {
          this.eventos = data;
          this.eventosFiltrados = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar eventos:', err);
          this.error = 'No se pudieron cargar los eventos. Intenta más tarde.';
          this.cargando = false;
        },
      });
    }
  }

  filtrarEventosPorCategoria(): void {
    if (this.categoriaActual) {
      this.eventosFiltrados = this.eventos.filter(evento =>
        evento.categoria.toLowerCase() === this.categoriaActual!.toLowerCase()
      );
    } else {
      this.eventosFiltrados = this.eventos;
    }
  }

  recargarEventos(): void {
    this.cargarEventos();
  }
}
