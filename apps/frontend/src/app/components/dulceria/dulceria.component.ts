import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DulceriaService } from '../../services/dulceria.service';
import { CarritosService } from '../../services/carritos.service';
import { AuthService } from '../../services/auth.service';
import { DulceriaItem, DulceriaItemTipo } from '../../models/dulceria.model';
import QRCode from 'qrcode';

interface ItemCarrito {
  item: DulceriaItem;
  cantidad: number;
}

@Component({
  selector: 'app-dulceria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dulceria.component.html',
  styleUrls: ['./dulceria.component.scss']
})
export class DulceriaComponent implements OnInit {
  items: DulceriaItem[] = [];
  itemsFiltrados: DulceriaItem[] = [];
  carrito: Map<string, ItemCarrito> = new Map();
  
  // Estados
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  
  // Filtros
  filtroBusqueda = '';
  filtroTipo: DulceriaItemTipo | '' = '';
  
  // Totales
  totalVenta = 0;
  cantidadTotal = 0;
  
  // Items agregándose
  agregando: Set<string> = new Set();

  // Pago con tarjeta
  mostrarModalPago = false;
  tarjetasGuardadas: any[] = [];
  tarjetaSeleccionada = '';
  nuevaTarjeta = {
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: '',
    guardar: false
  };

  // Recibo
  mostrarRecibo = false;
  recibo: any = null;
  private isBrowser: boolean;

  constructor(
    private dulceriaService: DulceriaService,
    private carritosService: CarritosService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadItems();
    this.cargarTarjetasGuardadas();
  }

  loadItems(): void {
    this.isLoading = true;
    console.log('🍿 Cargando items de dulcería...');
    
    this.dulceriaService.getItemsActivos().subscribe({
      next: (items) => {
        console.log('✅ Items cargados:', items.length);
        this.items = items;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar items:', error);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los productos';
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
    this.successMessage = `${item.nombre} agregado al carrito`;
    
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
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
      const precio = typeof itemCarrito.item.precio === 'string' 
        ? parseFloat(itemCarrito.item.precio) 
        : itemCarrito.item.precio;
      this.totalVenta += precio * itemCarrito.cantidad;
      this.cantidadTotal += itemCarrito.cantidad;
    });
  }

  getItemsCarrito(): ItemCarrito[] {
    return Array.from(this.carrito.values());
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

  finalizarCompra(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      alert('Debes iniciar sesión para continuar con la compra');
      this.router.navigate(['/login']);
      return;
    }

    if (this.carrito.size === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Abrir modal de pago
    this.mostrarModalPago = true;
    
    // Pre-seleccionar primera tarjeta guardada o 'nueva'
    if (this.tarjetasGuardadas.length > 0) {
      this.tarjetaSeleccionada = this.tarjetasGuardadas[0].id;
    } else {
      this.tarjetaSeleccionada = 'nueva';
    }
  }

  cargarTarjetasGuardadas(): void {
    if (!this.isBrowser) return;
    
    try {
      const tarjetasGuardadasStr = localStorage.getItem('tarjetasGuardadas');
      if (tarjetasGuardadasStr) {
        this.tarjetasGuardadas = JSON.parse(tarjetasGuardadasStr);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas guardadas:', error);
    }
  }

  guardarTarjeta(): void {
    if (!this.isBrowser) return;
    
    if (this.nuevaTarjeta.guardar && this.nuevaTarjeta.numero) {
      const tarjeta = {
        id: 'tarjeta-' + Date.now(),
        ultimos4: this.nuevaTarjeta.numero.slice(-4),
        nombre: this.nuevaTarjeta.nombre,
        vencimiento: this.nuevaTarjeta.vencimiento
      };
      this.tarjetasGuardadas.push(tarjeta);
      try {
        localStorage.setItem('tarjetasGuardadas', JSON.stringify(this.tarjetasGuardadas));
      } catch (error) {
        console.error('Error al guardar tarjeta:', error);
      }
    }
  }

  cerrarModalPago(): void {
    this.mostrarModalPago = false;
    this.tarjetaSeleccionada = '';
    this.nuevaTarjeta = {
      numero: '',
      nombre: '',
      vencimiento: '',
      cvv: '',
      guardar: false
    };
  }

  validarFormularioTarjeta(): boolean {
    if (this.tarjetaSeleccionada === 'nueva') {
      return !!(
        this.nuevaTarjeta.numero &&
        this.nuevaTarjeta.nombre &&
        this.nuevaTarjeta.vencimiento &&
        this.nuevaTarjeta.cvv &&
        this.nuevaTarjeta.numero.replace(/\s/g, '').length >= 13
      );
    }
    return !!this.tarjetaSeleccionada;
  }

  async confirmarCompraDulceria(): Promise<void> {
    if (!this.validarFormularioTarjeta()) {
      alert('Por favor complete todos los datos de la tarjeta');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    const token = this.authService.getToken();
    
    console.log('🔐 Estado de autenticación:', {
      hasUser: !!currentUser,
      hasToken: !!token,
      userId: currentUser?.id,
      userRole: currentUser?.rol,
      tokenLength: token?.length
    });
    
    if (!currentUser) {
      alert('Debes iniciar sesión para continuar');
      return;
    }
    
    if (!token) {
      alert('No hay token de autenticación. Por favor inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    // Guardar tarjeta si se seleccionó la opción
    if (this.tarjetaSeleccionada === 'nueva') {
      this.guardarTarjeta();
    }

    const tarjetaInfo = this.tarjetaSeleccionada === 'nueva' 
      ? `**** ${this.nuevaTarjeta.numero.slice(-4)}`
      : `**** ${this.tarjetasGuardadas.find(t => t.id === this.tarjetaSeleccionada)?.ultimos4}`;

    // Generar datos del recibo
    const ahora = new Date();
    const numeroOrden = 'DULC-' + Date.now().toString().slice(-8);
    
    try {
      // Preparar items para el pedido
      const items = Array.from(this.carrito.values()).map(itemCarrito => ({
        dulceriaItemId: itemCarrito.item.id,
        cantidad: itemCarrito.cantidad
      }));

      // Crear el pedido en el backend
      const response = await this.dulceriaService.procesarVenta(items).toPromise();
      
      console.log('✅ Respuesta del backend:', response);
      
      // El backend retorna { success, pedido, message }
      const pedido = response.pedido;

      // Generar código QR basado en el ID del pedido
      const codigoQR = `DULC-${pedido.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(codigoQR, { 
        width: 300, 
        margin: 2 
      });

      // Crear objeto de recibo
      this.recibo = {
        numeroOrden,
        pedidoId: pedido.id,
        fecha: ahora.toLocaleDateString('es-MX'),
        hora: ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        tarjeta: tarjetaInfo,
        items: Array.from(this.carrito.values()).map(ic => ({
          nombre: ic.item.nombre,
          cantidad: ic.cantidad,
          precioUnitario: typeof ic.item.precio === 'string' 
            ? parseFloat(ic.item.precio) 
            : ic.item.precio,
          subtotal: (typeof ic.item.precio === 'string' 
            ? parseFloat(ic.item.precio) 
            : ic.item.precio) * ic.cantidad
        })),
        total: this.totalVenta,
        qrCode: qrCodeDataUrl,
        urlValidacion: `${window.location.origin}/validar-boletos`
      };

      // Cerrar modal de pago y mostrar recibo
      this.mostrarModalPago = false;
      this.mostrarRecibo = true;

      // Limpiar carrito
      this.carrito.clear();
      this.calcularTotales();

    } catch (error) {
      console.error('❌ Error al procesar la compra:', error);
      alert('Error al procesar la compra. Por favor intente de nuevo.');
    }
  }

  cerrarRecibo(): void {
    this.mostrarRecibo = false;
    this.recibo = null;
    this.router.navigate(['/cliente']);
  }

  imprimirTicket(): void {
    window.print();
  }

  descargarTicket(): void {
    if (!this.recibo) return;

    let contenido = '=== TICKET DE COMPRA - DULCERÍA ===\n\n';
    contenido += `Orden: ${this.recibo.numeroOrden}\n`;
    contenido += `Fecha: ${this.recibo.fecha}\n`;
    contenido += `Hora: ${this.recibo.hora}\n`;
    contenido += `Tarjeta: ${this.recibo.tarjeta}\n\n`;
    contenido += '--- PRODUCTOS ---\n';
    
    this.recibo.items.forEach((item: any) => {
      contenido += `${item.cantidad}x ${item.nombre}\n`;
      contenido += `  ${this.formatearPrecio(item.precioUnitario)} c/u = ${this.formatearPrecio(item.subtotal)}\n`;
    });
    
    contenido += `\nTOTAL: ${this.formatearPrecio(this.recibo.total)}\n\n`;
    contenido += `Código QR: DULC-${this.recibo.pedidoId}\n`;
    contenido += `Validar en: ${this.recibo.urlValidacion}\n`;
    contenido += '\n¡Gracias por su compra!';

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-dulceria-${this.recibo.numeroOrden}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  estaAgregando(itemId: string): boolean {
    return this.agregando.has(itemId);
  }

  getTipoString(tipo: string): string {
    return tipo === 'COMBO' ? 'Combo' : 'Dulce';
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

  formatearPrecio(precio: number | string): string {
    const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precioNum);
  }
}
