import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { HistorialCompraDTO, MensajeResponseDTO } from '../../models/evento.model';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE MIS ENTRADAS HISTORIAL ###### */
// ------ Representa Formulario Completo Del Listado Comercial Transaccional Con Opceion De Cancelar ------
@Component({
  selector: 'app-mis-entradas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeroComponent],
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css'],
})
export class MisEntradasComponent implements OnInit {

  /* ###### ESTADOS Y ALMACENES MEMORIA GENERAL ###### */

  // ------ Array Solicitado Crudo Entero ------
  compras: HistorialCompraDTO[] = [];
  // ------ Render Clon Manipulable Mediante Switch En Frontend ------
  comprasFiltradas: HistorialCompraDTO[] = [];

  // ------ Activador Del Retorno Boolean Solo Pendientes ------
  mostrarSoloPendientes: boolean = false;
  // ------ Animador Spinner Cargando ------
  cargando: boolean = false;
  // ------ Guardador Eventual De Falla Servidor ------
  error: string | null = null;
  // ------ Receptor Frase De Confirmacion Asincronia Exito ------
  exito: string | null = null;

  /* ###### CONSTRUCTOR CENTRAL ###### */

  // ------ Solamente Injecta Modulo Comunicador Hacia Rutas Rest Controlador Ticket ------
  constructor(private eventoService: EventoService) { }

  /* ###### CICLO VIDA CON CARGADO AUTO ###### */

  // ------ Detonacion De Consulta Previa Construccion ------
  ngOnInit(): void {
    this.cargarCompras();
  }

  /* ###### GESTION DE OBTENCION DEL LISTADO ###### */

  // ------ Disparador Diferencial Entre Endpoint Pendiente O Endpoint General ------
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

  /* ###### FILTRADOR ACCIONADO POR BOOLEAN ###### */

  // ------ Niega Y Restaura De Nuevo La Descarga Total ------
  toggleFiltroPendientes(): void {
    this.mostrarSoloPendientes = !this.mostrarSoloPendientes;
    this.cargarCompras();
  }

  /* ###### MANEJO ELIMINACION O DEVOLUCION TICKET ###### */

  // ------ Disparador Seguro A Endpoint Delete Con Mensaje Interfaz Alerta ------
  cancelarCompra(compra: HistorialCompraDTO): void {
    const diasRestantes = this.getDiasRestantes(compra);
    // ------ Advertencia Nativa JS Detiene Posible Pulsacion Error ------
    if (!confirm(`¿Estás seguro de que quieres cancelar esta compra? Faltan ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} para el evento. El importe será devuelto a tu tarjeta.`)) {
      return;
    }

    this.eventoService.cancelarCompra(compra.id).subscribe({
      next: (respuesta) => {
        this.exito = respuesta.mensaje;
        this.cargarCompras(); // ------ Recargar La Lista ------
      },
      error: (err) => {
        console.error('Error cancelando compra:', err);
        this.error = 'No se pudo cancelar la compra. Intenta de nuevo más tarde.';
      },
    });
  }

  /* ###### CALCULOS TEMPORALES REACTIVOS FRONTEND ###### */

  // ------ Verificador Condicional Para Impedir Bloqueo Mayor 5 Dias ------
  puedeCancelar(compra: HistorialCompraDTO): boolean {
    // ------ Se Puede Cancelar Si Faltan Mas De 5 Dias Para El Evento ------
    const diasRestantes = this.calcularDiasRestantes(compra.fechaSesion);
    const estadoNoCancelado = compra.estado.toLowerCase() !== 'cancelada';
    return estadoNoCancelado && diasRestantes > 5;
  }

  // ------ Envoltorio A Objeto Entero Metodo Helper ------
  getDiasRestantes(compra: HistorialCompraDTO): number {
    return this.calcularDiasRestantes(compra.fechaSesion);
  }

  // ------ Generador Formateado Textual Acorde Al Tiempo Restante Restrictivo ------
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

  // ------ Helper Base Conversor Milesimas Matematica Absoluta ------
  private calcularDiasRestantes(fechaSesion: string): number {
    const fechaEvento = new Date(fechaSesion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // ------ Resetear Horas Para Comparacion Justa ------
    fechaEvento.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaEvento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    return diasRestantes;
  }

  /* ###### CONVERTIDORES LOGICA CSS AL FRONT ###### */

  // ------ Atribuye Clase Visual Acorde A String Devuelto Servidor ------
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
