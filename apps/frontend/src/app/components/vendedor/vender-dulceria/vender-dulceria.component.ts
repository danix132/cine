import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DulceriaService } from '../../../services/dulceria.service';
import { AuthService } from '../../../services/auth.service';
import { DulceriaItem, DulceriaItemTipo } from '../../../models/dulceria.model';

interface ItemCarrito {
  item: DulceriaItem;
  cantidad: number;
}

@Component({
  selector: 'app-vender-dulceria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vender-dulceria.component.html',
  styleUrls: ['./vender-dulceria.component.scss']
})
export class VenderDulceriaComponent implements OnInit {
  items: DulceriaItem[] = [];
  itemsFiltrados: DulceriaItem[] = [];
  carrito: Map<string, ItemCarrito> = new Map();
  
  // Estados
  loading = false;
  procesandoVenta = false;
  
  // Modales
  mostrarModalConfirmacion = false;
  mostrarModalExito = false;
  
  // Filtros
  filtroBusqueda = '';
  filtroTipo: DulceriaItemTipo | '' = '';
  
  // Totales
  totalVenta = 0;
  cantidadTotal = 0;
  
  // Enums para el template
  DulceriaItemTipo = DulceriaItemTipo;
  
  // Datos de venta exitosa
  ventaExitosa: any = null;

  constructor(
    private dulceriaService: DulceriaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarItems();
  }

  cargarItems(): void {
    this.loading = true;
    console.log('🍿 Cargando items de dulcería...');
    
    this.dulceriaService.getItemsActivos().subscribe({
      next: (items) => {
        console.log('✅ Items cargados:', items.length);
        this.items = items;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar items:', error);
        this.loading = false;
        alert('Error al cargar los productos. Por favor intente nuevamente.');
      }
    });
  }

  aplicarFiltros(): void {
    this.itemsFiltrados = this.items.filter(item => {
      const matchBusqueda = !this.filtroBusqueda || 
        item.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      
      const matchTipo = !this.filtroTipo || item.tipo === this.filtroTipo;
      
      return matchBusqueda && matchTipo;
    });
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroTipo = '';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroTipo);
  }

  agregarAlCarrito(item: DulceriaItem): void {
    console.log('➕ Agregando al carrito:', item.nombre);
    
    if (this.carrito.has(item.id)) {
      const itemCarrito = this.carrito.get(item.id)!;
      itemCarrito.cantidad++;
    } else {
      this.carrito.set(item.id, {
        item: item,
        cantidad: 1
      });
    }
    
    this.calcularTotales();
  }

  quitarDelCarrito(itemId: string): void {
    console.log('➖ Quitando del carrito:', itemId);
    
    if (this.carrito.has(itemId)) {
      const itemCarrito = this.carrito.get(itemId)!;
      
      if (itemCarrito.cantidad > 1) {
        itemCarrito.cantidad--;
      } else {
        this.carrito.delete(itemId);
      }
      
      this.calcularTotales();
    }
  }

  eliminarDelCarrito(itemId: string): void {
    console.log('🗑️ Eliminando del carrito:', itemId);
    this.carrito.delete(itemId);
    this.calcularTotales();
  }

  actualizarCantidad(itemId: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarDelCarrito(itemId);
      return;
    }
    
    if (this.carrito.has(itemId)) {
      this.carrito.get(itemId)!.cantidad = cantidad;
      this.calcularTotales();
    }
  }

  calcularTotales(): void {
    this.totalVenta = 0;
    this.cantidadTotal = 0;
    
    this.carrito.forEach(itemCarrito => {
      this.totalVenta += itemCarrito.item.precio * itemCarrito.cantidad;
      this.cantidadTotal += itemCarrito.cantidad;
    });
  }

  getItemsCarrito(): ItemCarrito[] {
    return Array.from(this.carrito.values());
  }

  confirmarVenta(): void {
    console.log('🎯 Confirmar venta de dulcería');
    
    if (this.carrito.size === 0) {
      alert('El carrito está vacío. Agregue productos para continuar.');
      return;
    }
    
    this.mostrarModalConfirmacion = true;
  }

  procesarVenta(): void {
    console.log('🚀 Procesando venta de dulcería...');
    
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      console.error('❌ Usuario no autenticado');
      alert('Error de autenticación. Por favor inicie sesión nuevamente.');
      return;
    }
    
    this.procesandoVenta = true;
    
    // Preparar los datos de la venta para el backend
    const itemsVenta = Array.from(this.carrito.values()).map(itemCarrito => ({
      dulceriaItemId: itemCarrito.item.id,
      cantidad: itemCarrito.cantidad
    }));
    
    // Llamar al endpoint del backend
    this.dulceriaService.procesarVenta(itemsVenta).subscribe({
      next: (response) => {
        console.log('✅ Venta procesada exitosamente:', response);
        
        // Preparar datos para mostrar en el ticket
        const itemsConDetalle = Array.from(this.carrito.values()).map(itemCarrito => ({
          dulceriaItemId: itemCarrito.item.id,
          nombre: itemCarrito.item.nombre,
          cantidad: itemCarrito.cantidad,
          precioUnitario: itemCarrito.item.precio,
          subtotal: itemCarrito.item.precio * itemCarrito.cantidad
        }));
        
        // Guardar datos de la venta exitosa
        this.ventaExitosa = {
          items: itemsConDetalle,
          total: this.totalVenta,
          cantidadTotal: this.cantidadTotal,
          fecha: new Date(),
          vendedor: currentUser,
          pedidoId: response.pedido?.id
        };
        
        this.procesandoVenta = false;
        this.mostrarModalConfirmacion = false;
        this.mostrarModalExito = true;
        
        // Limpiar carrito
        this.carrito.clear();
        this.calcularTotales();
      },
      error: (error) => {
        console.error('❌ Error al procesar la venta:', error);
        this.procesandoVenta = false;
        
        let mensaje = 'Ocurrió un error al procesar la venta. Por favor intente nuevamente.';
        if (error.error?.message) {
          mensaje = error.error.message;
        }
        
        alert(mensaje);
      }
    });
  }

  cancelarVenta(): void {
    if (this.procesandoVenta) {
      return;
    }
    
    this.mostrarModalConfirmacion = false;
  }

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.ventaExitosa = null;
  }

  irANuevaVenta(): void {
    this.cerrarModalExito();
    this.carrito.clear();
    this.calcularTotales();
  }

  imprimirTicket(): void {
    if (!this.ventaExitosa) {
      alert('No hay datos de venta para imprimir');
      return;
    }
    
    console.log('🖨️ Generando ticket de venta...');
    
    const htmlTicket = this.generarHTMLTicket();
    
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    
    if (!ventanaImpresion) {
      alert('No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.');
      return;
    }
    
    ventanaImpresion.document.write(htmlTicket);
    ventanaImpresion.document.close();
    ventanaImpresion.document.title = 'Ticket de Venta - Dulcería';
    
    ventanaImpresion.onload = () => {
      setTimeout(() => {
        ventanaImpresion.print();
      }, 300);
    };
  }

  private generarHTMLTicket(): string {
    const fecha = this.ventaExitosa.fecha;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket de Venta - Dulcería</title>
        <style>
          @page { size: 80mm auto; margin: 5mm; }
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            width: 80mm;
            margin: 0 auto;
            padding: 10px;
          }
          .header { text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
          .title { font-size: 18px; font-weight: bold; }
          .subtitle { font-size: 14px; margin-top: 5px; }
          .fecha { font-size: 11px; margin-top: 10px; }
          .items { margin: 15px 0; }
          .item { margin: 8px 0; display: flex; justify-content: space-between; }
          .item-nombre { flex: 1; }
          .item-cantidad { width: 40px; text-align: center; }
          .item-precio { width: 80px; text-align: right; }
          .totales { border-top: 2px dashed #000; padding-top: 10px; margin-top: 15px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total-final { font-size: 16px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px; font-size: 11px; }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">🍿 CINE DIGITAL 🍿</div>
          <div class="subtitle">TICKET DE DULCERÍA</div>
          <div class="fecha">${this.formatearFecha(fecha.toISOString())} ${this.formatearHora(fecha.toISOString())}</div>
        </div>
        
        <div class="items">
    `;
    
    this.ventaExitosa.items.forEach((item: any) => {
      html += `
          <div class="item">
            <span class="item-nombre">${item.nombre}</span>
            <span class="item-cantidad">x${item.cantidad}</span>
            <span class="item-precio">$${item.subtotal.toFixed(2)}</span>
          </div>
      `;
    });
    
    html += `
        </div>
        
        <div class="totales">
          <div class="total-row">
            <span>Cantidad de items:</span>
            <span>${this.ventaExitosa.cantidadTotal}</span>
          </div>
          <div class="total-row total-final">
            <span>TOTAL:</span>
            <span>$${this.ventaExitosa.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>¡Gracias por su compra!</p>
          <p>Disfrute su función</p>
          <p>Vendedor: ${this.ventaExitosa.vendedor.nombre}</p>
        </div>
      </body>
      </html>
    `;
    
    return html;
  }

  volverInicio(): void {
    this.router.navigate(['/vendedor']);
  }

  limpiarCarrito(): void {
    if (this.carrito.size === 0) {
      return;
    }
    
    if (confirm('¿Está seguro de que desea vaciar el carrito?')) {
      this.carrito.clear();
      this.calcularTotales();
    }
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatearHora(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getTipoIcono(tipo: DulceriaItemTipo): string {
    switch (tipo) {
      case DulceriaItemTipo.COMBO:
        return '🍿';
      case DulceriaItemTipo.DULCE:
        return '🍬';
      default:
        return '🛒';
    }
  }
}
