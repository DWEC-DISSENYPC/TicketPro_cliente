import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CarritoItem, CarritoAddRequest } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = '/api/carrito';
  private cartItemsCount = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCount.asObservable();

  constructor(private http: HttpClient) {
    // Inicializar el contador si el usuario ya está logueado
    if (localStorage.getItem('token')) {
      this.actualizarContador();
    }
  }

  obtenerCarrito(): Observable<CarritoItem[]> {
    return this.http.get<CarritoItem[]>(this.apiUrl).pipe(
      tap(items => this.cartItemsCount.next(items.reduce((acc, item) => acc + item.cantidad, 0)))
    );
  }

  agregarAlCarrito(request: CarritoAddRequest): Observable<string> {
    return this.http.post( `${this.apiUrl}/add`, request, { responseType: 'text' }).pipe(
      tap(() => this.actualizarContador())
    );
  }

  eliminarDelCarrito(itemId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${itemId}`, { responseType: 'text' }).pipe(
      tap(() => this.actualizarContador())
    );
  }

  vaciarCarrito(): Observable<string> {
    return this.http.delete(`${this.apiUrl}/clear`, { responseType: 'text' }).pipe(
      tap(() => this.cartItemsCount.next(0))
    );
  }

  finalizarCompra(): Observable<string> {
    return this.http.post(`${this.apiUrl}/checkout`, {}, { responseType: 'text' }).pipe(
      tap(() => this.cartItemsCount.next(0))
    );
  }

  actualizarContador(): void {
    this.http.get<CarritoItem[]>(this.apiUrl).subscribe({
      next: (items) => {
        const count = items.reduce((acc, item) => acc + item.cantidad, 0);
        this.cartItemsCount.next(count);
      },
      error: () => this.cartItemsCount.next(0)
    });
  }
}
