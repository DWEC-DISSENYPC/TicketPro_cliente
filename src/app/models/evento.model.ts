/* ###### COLECCION DE MODELOS Y DTO RELATIVOS AL NEGOCIO ###### */

/* ------ Esqueleto Completo Informativo De Un Evento Cultural O Deportivo ------ */
export interface EventoDTO {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenUrl: string;
  duracionMinutos: number;
  estado: string;
}

/* ------ Cada Una De Las Fechas En Que Un Evento Ocurre Ademas De Capacidad Y Costo ------ */
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

/* ------ Solicitud Post De Compra Para Checkout Requerido Al Usuario ------ */
export interface CompraEntradasDTO {
  sesionId: number;
  cantidad: number;
}

/* ------ Linea Resume De Un Ticket Adquirido Mapeada Para Historial Simplificado Front ------ */
export interface HistorialCompraDTO {
  id: number;
  localizador: string;
  tituloEvento: string;
  fechaSesion: string;
  numEntradas: number;
  totalPagado: number;
  estado: string;
}

/* ------ Profundidad Absoluta Sobre Una Compra Expandiendo Hacia Cada Ticket Especifico Imprimible ------ */
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

/* ------ Objeto Canjeable Singular Formador De Arrays Dentro Del Detalle De Compra Principal ------ */
export interface TicketDTO {
  id: number;
  codigo: string;
  qrCode: string;
  usado: boolean;
}

/* ------ Helper Rest Envoltorio A Strings Standard ------ */
export interface MensajeResponseDTO {
  mensaje: string;
}
