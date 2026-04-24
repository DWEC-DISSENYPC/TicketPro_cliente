export interface CarritoItem {
  id: number;
  sesionId: number;
  eventoTitulo: string;
  imagenUrl: string;
  fechaHora: string | Date;
  nombreSala: string;
  nombreUbicacion: string;
  precioBase: number;
  cantidad: number;
  subtotal: number;
}

export interface CarritoAddRequest {
  sesionId: number;
  cantidad: number;
}
