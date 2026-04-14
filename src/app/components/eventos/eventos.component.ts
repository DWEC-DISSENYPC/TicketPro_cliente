import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';
import { EventoService } from '../../services/evento.service';
import { EventoDTO } from '../../models/evento.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* ###### COMPONENTE DE EVENTOS COMPARTIDO ###### */
// ------ Expone Las Diferentes Vertientes De Listados Publicos Y Accesibles ------
@Component({
  selector: 'app-eventos',
  imports: [HeroComponent, CommonModule, RouterModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit, OnDestroy {
  /* ###### PROPIEDADES ENVIADAS POR EL PADRE (HERO) ###### */

  // ------ Variables Sobre-Escritas Si Se Le Inyecta Valor Por Etiqueta ------
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() imagenFondo: string = '';
  @Input() altura: string = '70vh';

  /* ###### ALMACENES Y ESTADOS CENTRALES ###### */

  // ------ Dtos Completos Devueltos Por La Promesa ------
  eventos: EventoDTO[] = [];
  // ------ Listado Despues De Pasar Por Las Capas De Corte ------
  eventosFiltrados: EventoDTO[] = [];
  // ------ Renderizado De Cargando ------
  cargando: boolean = false;
  // ------ Notificador De Falla ------
  error: string | null = null;
  // ------ Limite Del Select Sql Que Retorna ------
  cantidadEventos: number = 8;

  /* ###### SUSCRIPCIONES Y CATEGORIZADOR ###### */

  // ------ Control De Filtro Url Constante ------
  categoriaActual: string | null = null;
  // ------ Suscripcion Recicable A La Fuga De Memoria ------
  private routeSub: Subscription = new Subscription();

  /* ###### CONSTRUCTOR PRINCIPAL ###### */

  // ------ Pone En Marcha Los Servicios Requeridos Http ------
  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute
  ) {}

  /* ###### CICLO DE INICIO ON INIT ###### */

  // ------ Suscribirse A Cambios Constantes En Los Parametros De La Ruta Local ------
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.categoriaActual = params['categoria'] || null;
      this.cargarEventos();
    });
  }

  /* ###### CICLO POSTERIOR (DESTRUCCION DE OBJETO) ###### */

  // ------ Al Abandonar La Capa Destruye La Escucha Dinamica ------
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  /* ###### SOLICITUDES Y ENCLAVE HTTP ###### */

  // ------ Detonacion Comun Que Alterna Entre Filtrado O Default Aleatoria ------
  cargarEventos(): void {
    this.cargando = true;
    this.error = null;

    if (this.categoriaActual) {
      // ------ Si Hay Una Categoria Seleccionada Obtener Todos Los Eventos Y Filtrar ------
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
      // ------ Si No Hay Categoria Mostrar Eventos Aleatorios O Novedosos ------
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

  /* ###### FILTRADO DIRECTO DEL FRONTEND ###### */

  // ------ Patea Objetos Invalidos Si Sus Propiedades Categoricas Difieren ------
  filtrarEventosPorCategoria(): void {
    if (this.categoriaActual) {
      this.eventosFiltrados = this.eventos.filter(
        (evento) => evento.categoria.toLowerCase() === this.categoriaActual!.toLowerCase()
      );
    } else {
      this.eventosFiltrados = this.eventos;
    }
  }

  /* ###### REPETICION PUBLICADA ###### */

  // ------ Enlace Entre Html Y La Obtencion Replicada ------
  recargarEventos(): void {
    this.cargarEventos();
  }
}
