import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraEntradasDTO, DetalleCompraDTO, EventoDTO, HistorialCompraDTO, MensajeResponseDTO, SesionDTO, TicketDTO } from '../models/evento.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api';
  private eventosUrl = `${this.apiUrl}/eventos`;

  constructor(private http: HttpClient) {}

  // Obtener todos los eventos
  listarTodos(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.eventosUrl}`);
  }

  // Obtener un evento por ID
  obtenerPorId(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${this.eventosUrl}/${id}`);
  }

  // Obtener eventos aleatorios (será el nuevo endpoint)
  obtenerEventosAleatorios(cantidad: number = 8): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(
      `${this.eventosUrl}/aleatorios?cantidad=${cantidad}`,
    );
  }

  listarSesionesPorEvento(eventoId: number): Observable<SesionDTO[]> {
    return this.http.get<SesionDTO[]>(`${this.apiUrl}/sesiones/evento/${eventoId}`);
  }

  realizarCompra(compra: CompraEntradasDTO): Observable<string> {
    return this.http.post(`${this.apiUrl}/compras`, compra, {
      responseType: 'text' as const,
    });
  }

  listarMisCompras(): Observable<HistorialCompraDTO[]> {
    return this.http.get<HistorialCompraDTO[]>(`${this.apiUrl}/compras/mis-compras`);
  }

  obtenerDetalleCompra(id: number): Observable<DetalleCompraDTO> {
    return this.http.get<DetalleCompraDTO>(`${this.apiUrl}/compras/${id}`);
  }

  cancelarCompra(id: number): Observable<MensajeResponseDTO> {
    return this.http.delete<MensajeResponseDTO>(`${this.apiUrl}/compras/${id}/cancelar`);
  }

  listarComprasPendientes(): Observable<DetalleCompraDTO[]> {
    return this.http.get<DetalleCompraDTO[]>(`${this.apiUrl}/compras/pendientes`);
  }

  // Obtener todas las categorías únicas de eventos
  obtenerCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.eventosUrl}/categorias`);
  }

  // Buscar eventos por título o ciudad
  buscar(termino: string): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.eventosUrl}/buscar?termino=${termino}`);
  }

  // Descargar una imagen desde una URL externa como Blob
  descargarImagen(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
