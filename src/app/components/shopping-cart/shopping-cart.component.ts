import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  loading = true;
  processing = false;
  totalPrecio = 0;
  totalItems = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.loading = true;
    this.carritoService.obtenerCarrito().subscribe({
      next: (items) => {
        this.items = items;
        this.calcularTotales();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el carrito', err);
        this.loading = false;
      }
    });
  }

  calcularTotales(): void {
    this.totalPrecio = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    this.totalItems = this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  eliminarItem(id: number): void {
    this.carritoService.eliminarDelCarrito(id).subscribe({
      next: () => {
        this.items = this.items.filter(item => item.id !== id);
        this.calcularTotales();
      },
      error: (err) => console.error('Error al eliminar ítem', err)
    });
  }

  checkout(): void {
    this.processing = true;
    this.carritoService.finalizarCompra().subscribe({
      next: (response) => {
        alert('¡Compra realizada con éxito! Revisa tus entradas en "Mis Entradas".');
        this.router.navigate(['/mis-compras']);
      },
      error: (err) => {
        console.error('Error en el checkout', err);
        alert('Hubo un error al procesar tu compra. Inténtalo de nuevo.');
        this.processing = false;
      }
    });
  }
}
