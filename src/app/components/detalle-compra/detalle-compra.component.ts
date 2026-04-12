import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { DetalleCompraDTO, MensajeResponseDTO } from '../../models/evento.model';

@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css'],
})
export class DetalleCompraComponent implements OnInit {
  compra: DetalleCompraDTO | null = null;
  cargando: boolean = false;
  error: string | null = null;
  exito: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.cargarDetalleCompra(id);
    } else {
      this.error = 'ID de compra inválido.';
    }
  }

  cargarDetalleCompra(id: number): void {
    this.cargando = true;
    this.error = null;
    this.exito = null;

    this.eventoService.obtenerDetalleCompra(id).subscribe({
      next: (compra) => {
        this.compra = compra;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando detalle de compra:', err);
        this.error = 'No se pudo cargar el detalle de la compra.';
        this.cargando = false;
      },
    });
  }

  cancelarCompra(): void {
    if (!this.compra) return;

    const diasRestantes = this.getDiasRestantes();
    if (!confirm(`¿Estás seguro de que quieres cancelar esta compra? Faltan ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} para el evento. El importe será devuelto a tu tarjeta.`)) {
      return;
    }

    this.eventoService.cancelarCompra(this.compra.id).subscribe({
      next: (respuesta) => {
        this.exito = respuesta.mensaje;
        // Recargar los detalles para reflejar el cambio de estado
        this.cargarDetalleCompra(this.compra!.id);
      },
      error: (err) => {
        console.error('Error cancelando compra:', err);
        this.error = 'No se pudo cancelar la compra. Intenta de nuevo más tarde.';
      },
    });
  }

  puedeCancelar(): boolean {
    if (!this.compra) return false;
    // Se puede cancelar si faltan más de 5 días para el evento
    const diasRestantes = this.calcularDiasRestantes(this.compra.fechaSesion);
    return diasRestantes > 5;
  }

  getDiasRestantes(): number {
    if (!this.compra) return 0;
    return this.calcularDiasRestantes(this.compra.fechaSesion);
  }

  getMensajeCancelacion(): string {
    if (!this.compra) return '';
    const diasRestantes = this.calcularDiasRestantes(this.compra.fechaSesion);
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

  descargarQR(ticketId: number): void {
    // Esta función podría implementar la descarga del código QR
    // Por ahora solo mostramos un mensaje
    alert('Funcionalidad de descarga QR próximamente disponible.');
  }
}
