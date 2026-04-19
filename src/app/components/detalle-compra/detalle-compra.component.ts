import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { DetalleCompraDTO, MensajeResponseDTO } from '../../models/evento.model';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE DE DETALLE DE COMPRA ###### */
// ------ Se Encarga De Mostrar Y Gestionar Las Entradas Ya Compradas ------
@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroComponent],
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css'],
})
export class DetalleCompraComponent implements OnInit {

  /* ###### ESTADOS Y VARIABLES PUBLICAS ###### */

  // ------ Guarda Objeto Dto De La Compra ------
  compra: DetalleCompraDTO | null = null;
  // ------ Indicador Visual De Carga Desde Api ------
  cargando: boolean = false;
  // ------ Variable Para Capturar Mensajes De Error ------
  error: string | null = null;
  // ------ Variable Para Transmitir Mensajes De Exito ------
  exito: string | null = null;

  /* ###### CONSTRUCTOR ###### */

  // ------ Inyecta El Servicio Rest Y El Manejador De Rutas Activas ------
  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  /* ###### CICLO DE VIDA OND INIT ###### */

  // ------ Detecta El Parametro Enviado En La Ruta Al Entrar ------
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.cargarDetalleCompra(id);
    } else {
      this.error = 'ID de compra inválido.';
    }
  }

  /* ###### FUNCIONES DE CARGA Y LOGICA PRINCIPAL ###### */

  // ------ Hace Solicitud Http Al Backend Para Cargar Compra Completa ------
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

  // ------ Emite Cancelacion Si El Boton Esta Disponible Y El Metodo Acuerda Confirmacion ------
  cancelarCompra(): void {
    if (!this.compra) return;

    const diasRestantes = this.getDiasRestantes();
    if (!confirm(`¿Estás seguro de que quieres cancelar esta compra? Faltan ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} para el evento. El importe será devuelto a tu tarjeta.`)) {
      return;
    }

    this.eventoService.cancelarCompra(this.compra.id).subscribe({
      next: (respuesta) => {
        this.exito = respuesta.mensaje;
        // ------ Recargar Los Detalles Para Reflejar El Cambio De Estado ------
        this.cargarDetalleCompra(this.compra!.id);
      },
      error: (err) => {
        console.error('Error cancelando compra:', err);
        this.error = 'No se pudo cancelar la compra. Intenta de nuevo más tarde.';
      },
    });
  }

  /* ###### CONTROLADORES DE RENDERIZADO VISUAL ###### */

  // ------ Retorna Si Efectivamente Han Pasado Menos De 5 Dias Para Estar En Plazo Ocultable ------
  puedeCancelar(): boolean {
    if (!this.compra) return false;
    // ------ Se Puede Cancelar Si Faltan Mas De 5 Dias Para El Evento ------
    const diasRestantes = this.calcularDiasRestantes(this.compra.fechaSesion);
    return diasRestantes > 5;
  }

  // ------ Funcion Puente Exclusiva Para Enviar Dias Calculados De Vuelta ------
  getDiasRestantes(): number {
    if (!this.compra) return 0;
    return this.calcularDiasRestantes(this.compra.fechaSesion);
  }

  // ------ Prepara El Texto Mostrado Debajo Si Ya Es Demasiado Tarde ------
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

  // ------ Funcion Utilitaria Para Diferenciar Tiempos Ms ------
  private calcularDiasRestantes(fechaSesion: string): number {
    const fechaEvento = new Date(fechaSesion);
    const hoy = new Date();
    // ------ Resetear Horas Para Comparacion Justa ------
    hoy.setHours(0, 0, 0, 0); 
    fechaEvento.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaEvento.getTime() - hoy.getTime();
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    return diasRestantes;
  }

  // ------ Clase De Css Personalizada Segun Si Es Valida O Expirada ------
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

  // ------ Dispara La Capacidad De Capturar O Obtener Recurso Codificado ------
  descargarQR(ticketId: number): void {
    if (!this.compra) return;

    const ticket = this.compra.tickets.find(t => t.id === ticketId);
    if (!ticket || !ticket.qrCode) {
      alert('No se pudo encontrar el código QR.');
      return;
    }

    this.eventoService.descargarImagen(ticket.qrCode).subscribe({
      next: (blob) => {
        // Crear un enlace temporal para la descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${this.compra?.localizador}-${ticketId}.png`;
        
        // Simular clic para iniciar descarga
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el QR:', err);
        alert('Hubo un problema al descargar el código QR. Por favor, inténtalo de nuevo.');
      }
    });
  }
}
