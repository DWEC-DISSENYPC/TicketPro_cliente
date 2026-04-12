export interface EventoDTO {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenUrl: string;
  duracionMinutos: number;
  estado: string;
}

export interface SesionDTO {
  id: number;
  fechaHora: string;
  precioBase: number;
  entradasVendidas: number;
  estado: number;
  nombreSala: string;
  capacidadSala: number;
  nombreUbicacion: string;
  ciudadUbicacion: string;
}

export interface CompraEntradasDTO {
  sesionId: number;
  cantidad: number;
}

export interface HistorialCompraDTO {
  id: number;
  localizador: string;
  tituloEvento: string;
  fechaSesion: string;
  numEntradas: number;
  totalPagado: number;
  estado: string;
}

export interface DetalleCompraDTO {
  id: number;
  localizador: string;
  tituloEvento: string;
  fechaSesion: string;
  numEntradas: number;
  totalPagado: number;
  estado: string;
  tickets: TicketDTO[];
}

export interface TicketDTO {
  id: number;
  codigo: string;
  qrCode: string;
  usado: boolean;
}

export interface MensajeResponseDTO {
  mensaje: string;
}
