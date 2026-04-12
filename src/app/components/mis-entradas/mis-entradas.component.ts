import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { HistorialCompraDTO, MensajeResponseDTO } from '../../models/evento.model';

@Component({
  selector: 'app-mis-entradas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css'],
})
export class MisEntradasComponent implements OnInit {
  compras: HistorialCompraDTO[] = [];
  comprasFiltradas: HistorialCompraDTO[] = [];
  mostrarSoloPendientes: boolean = false;
  cargando: boolean = false;
  error: string | null = null;
  exito: string | null = null;

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.error = null;
    this.exito = null;

    if (this.mostrarSoloPendientes) {
      this.eventoService.listarComprasPendientes().subscribe({
        next: (compras) => {
          this.compras = compras;
          this.comprasFiltradas = compras;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando compras pendientes:', err);
          this.error = 'No se pudieron cargar las compras pendientes.';
          this.cargando = false;
        },
      });
    } else {
      this.eventoService.listarMisCompras().subscribe({
        next: (compras) => {
          this.compras = compras;
          this.comprasFiltradas = compras;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando historial de compras:', err);
          this.error = 'No se pudo cargar el historial de compras.';
          this.cargando = false;
        },
      });
    }
  }

  toggleFiltroPendientes(): void {
    this.mostrarSoloPendientes = !this.mostrarSoloPendientes;
    this.cargarCompras();
  }

  cancelarCompra(compra: HistorialCompraDTO): void {
    const diasRestantes = this.getDiasRestantes(compra);
    if (!confirm(`¿Estás seguro de que quieres cancelar esta compra? Faltan ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} para el evento. El importe será devuelto a tu tarjeta.`)) {
      return;
    }

    this.eventoService.cancelarCompra(compra.id).subscribe({
      next: (respuesta) => {
        this.exito = respuesta.mensaje;
        this.cargarCompras(); // Recargar la lista
      },
      error: (err) => {
        console.error('Error cancelando compra:', err);
        this.error = 'No se pudo cancelar la compra. Intenta de nuevo más tarde.';
      },
    });
  }

  puedeCancelar(compra: HistorialCompraDTO): boolean {
    // Se puede cancelar si faltan más de 5 días para el evento
    const diasRestantes = this.calcularDiasRestantes(compra.fechaSesion);
    return diasRestantes > 5;
  }

  getDiasRestantes(compra: HistorialCompraDTO): number {
    return this.calcularDiasRestantes(compra.fechaSesion);
  }

  getMensajeCancelacion(compra: HistorialCompraDTO): string {
    const diasRestantes = this.calcularDiasRestantes(compra.fechaSesion);
    if (diasRestantes < 0) {
      return 'Evento ya realizado';
    } else if (diasRestantes > 5) {
      return `Cancelación disponible (${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restantes)`;
    } else {
      return `Cancelación no disponible (faltan ${diasRestantes} días)`;
    }
  }

  private calcularDiasRestantes(fechaSesion: string): number {
    const fechaEvento = new Date(fechaSesion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparación justa
    fechaEvento.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaEvento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    return diasRestantes;
  }

  getEstadoClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'usada' || estadoLower === 'confirmada') {
      return 'estado-usada';
    } else if (estadoLower === 'pendiente') {
      return 'estado-pendiente';
    } else if (estadoLower === 'cancelada') {
      return 'estado-cancelada';
    }
    return 'estado-otro';
  }
}
