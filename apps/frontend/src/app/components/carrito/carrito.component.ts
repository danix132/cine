import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritosService } from '../../services/carritos.service';
import { Carrito } from '../../models/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: Carrito | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private carritosService: CarritosService) {}

  ngOnInit(): void {
    this.loadCarrito();
  }

  loadCarrito(): void {
    this.isLoading = true;
    // Implementar lógica para cargar carrito activo
    this.isLoading = false;
  }

  getTotal(): number {
    if (!this.carrito?.items) return 0;
    return this.carrito.items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  }
}
