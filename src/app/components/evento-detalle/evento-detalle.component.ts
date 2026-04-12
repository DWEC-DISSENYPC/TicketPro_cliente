import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventoService } from '../../services/evento.service';
import { EventoDTO, SesionDTO, CompraEntradasDTO } from '../../models/evento.model';

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css'],
})
export class EventoDetalleComponent implements OnInit {
  evento: EventoDTO | null = null;
  sesiones: SesionDTO[] = [];
  sesionesFiltradas: SesionDTO[] = [];
  ciudades: string[] = [];
  ciudadSeleccionada: string | null = null;
  cantidadSeleccionada: Record<number, number> = {};
  cantidadAjustada: Record<number, boolean> = {};
  cargando: boolean = false;
  error: string | null = null;
  exitoCompra: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.cargarEventoDetalle(id);
    } else {
      this.error = 'ID de evento inválido.';
    }
  }

  cargarEventoDetalle(id: number): void {
    this.cargando = true;
    this.error = null;
    this.exitoCompra = null;

    forkJoin({
      evento: this.eventoService.obtenerPorId(id),
      sesiones: this.eventoService.listarSesionesPorEvento(id),
    }).subscribe({
      next: ({ evento, sesiones }) => {
        this.evento = evento;
        this.sesiones = sesiones || [];
        this.actualizarCiudades();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando el detalle del evento:', err);
        this.error = 'No se pudo cargar el detalle del evento. Intenta de nuevo más tarde.';
        this.cargando = false;
      },
    });
  }

  actualizarCiudades(): void {
    this.ciudades = Array.from(
      new Set(this.sesiones.map((sesion) => sesion.ciudadUbicacion).filter(Boolean))
    );
    this.ciudadSeleccionada = this.ciudades.length ? this.ciudades[0] : null;
    this.filtrarSesiones();
  }

  filtrarSesiones(): void {
    if (!this.ciudadSeleccionada) {
      this.sesionesFiltradas = [...this.sesiones];
      return;
    }

    this.sesionesFiltradas = this.sesiones.filter(
      (sesion) => sesion.ciudadUbicacion === this.ciudadSeleccionada
    );

    this.sesionesFiltradas.forEach((sesion) => {
      if (!this.cantidadSeleccionada[sesion.id]) {
        this.cantidadSeleccionada[sesion.id] = 1;
      }
    });
  }

  obtenerLocalizacion(): string {
    const sesion = this.sesionesFiltradas[0];
    if (!sesion) {
      return 'Información no disponible.';
    }
    return `${sesion.nombreSala}, ${sesion.nombreUbicacion}`;
  }

  entradasDisponibles(sesion: SesionDTO): number {
    return Math.max(0, (sesion.capacidadSala || 0) - (sesion.entradasVendidas || 0));
  }

  validarCantidad(sesion: SesionDTO): number {
    const disponible = this.entradasDisponibles(sesion);
    let cantidad = this.cantidadSeleccionada[sesion.id] ?? 1;
    this.cantidadAjustada[sesion.id] = false;

    if (cantidad < 1) {
      cantidad = 1;
    }
    if (cantidad > disponible) {
      cantidad = disponible;
      this.cantidadAjustada[sesion.id] = true;
    }

    return cantidad;
  }

  onCantidadChange(sesion: SesionDTO): void {
    this.cantidadSeleccionada[sesion.id] = this.validarCantidad(sesion);
  }

  cantidadNoValida(sesion: SesionDTO): boolean {
    const cantidad = this.cantidadSeleccionada[sesion.id] ?? 1;
    const disponible = this.entradasDisponibles(sesion);
    return cantidad < 1 || cantidad > disponible;
  }

  comprarSesion(sesion: SesionDTO): void {
    this.error = null;
    this.exitoCompra = null;

    const cantidad = this.validarCantidad(sesion);
    const disponible = this.entradasDisponibles(sesion);
    if (cantidad < 1 || cantidad > disponible) {
      this.error = `Selecciona entre 1 y ${disponible} entradas disponibles.`;
      return;
    }

    const compra: CompraEntradasDTO = {
      sesionId: sesion.id,
      cantidad,
    };

    this.eventoService.realizarCompra(compra).subscribe({
      next: (mensaje) => {
        this.exitoCompra = mensaje || 'Compra realizada con éxito.';
        // Limpiar la cantidad seleccionada y el aviso de ajuste
        delete this.cantidadSeleccionada[sesion.id];
        delete this.cantidadAjustada[sesion.id];
        // Recargar el detalle del evento para actualizar las entradas disponibles
        this.cargarEventoDetalle(this.evento!.id);
      },
      error: (err: any) => {
        console.error('Error al realizar compra:', err);

        // Manejo específico de errores
        if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (err.status === 401) {
          this.error = 'Debes iniciar sesión para realizar una compra.';
        } else if (err.status === 403) {
          this.error = 'No tienes permisos para realizar esta acción.';
        } else if (err.status === 404) {
          this.error = 'El servicio de compras no está disponible.';
        } else if (err.status >= 500) {
          this.error = 'Error interno del servidor. Intenta de nuevo más tarde.';
        } else {
          this.error = err.error?.message || err.message || 'No se pudo completar la compra. Intenta de nuevo más tarde.';
        }
      },
    });
  }
}
