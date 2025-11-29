import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DulceriaService } from '../../services/dulceria.service';
import { CarritosService } from '../../services/carritos.service';
import { AuthService } from '../../services/auth.service';
import { TicketPdfService } from '../../services/ticket-pdf.service';
import { PedidosService } from '../../services/pedidos.service';
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
  
  // Constantes de tipo
  readonly TIPO_COMBO = DulceriaItemTipo.COMBO;
  readonly TIPO_DULCE = DulceriaItemTipo.DULCE;
  
  // Totales
  totalVenta = 0;
  cantidadTotal = 0;
  
  // Items agregándose
  agregando: Set<string> = new Set();

  // Modal del carrito
  mostrarCarrito = false;

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
    private ticketPdfService: TicketPdfService,
    private pedidosService: PedidosService,
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
        console.log('📷 Imágenes de items:', items.map(i => ({ nombre: i.nombre, imagenUrl: i.imagenUrl })));
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

  cambiarCategoria(tipo: DulceriaItemTipo | ''): void {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  agregarAlCarrito(item: DulceriaItem): void {
    console.log('➕ Agregando al carrito:', item.nombre);
    
    // Validar stock disponible
    const cantidadEnCarrito = this.carrito.has(item.id) ? this.carrito.get(item.id)!.cantidad : 0;
    
    if (cantidadEnCarrito >= item.stock) {
      this.errorMessage = `No hay más stock disponible de ${item.nombre} (Stock: ${item.stock})`;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }
    
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
      const itemCarrito = this.carrito.get(itemId)!;
      const item = itemCarrito.item;
      
      // Validar que no exceda el stock
      if (cantidad > item.stock) {
        this.errorMessage = `Solo hay ${item.stock} unidades disponibles de ${item.nombre}`;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        // Mantener la cantidad actual
        return;
      }
      
      itemCarrito.cantidad = cantidad;
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

  toggleCarrito(): void {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  cerrarCarrito(): void {
    this.mostrarCarrito = false;
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

    // Cerrar modal del carrito y abrir modal de pago
    this.mostrarCarrito = false;
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
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    try {
      const userKey = `tarjetasGuardadas_${currentUser.id}`;
      const tarjetasGuardadasStr = localStorage.getItem(userKey);
      if (tarjetasGuardadasStr) {
        this.tarjetasGuardadas = JSON.parse(tarjetasGuardadasStr);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas guardadas:', error);
    }
  }

  guardarTarjeta(): void {
    if (!this.isBrowser) return;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    if (this.nuevaTarjeta.guardar && this.nuevaTarjeta.numero) {
      const tarjeta = {
        id: 'tarjeta-' + Date.now(),
        ultimos4: this.nuevaTarjeta.numero.slice(-4),
        nombre: this.nuevaTarjeta.nombre,
        vencimiento: this.nuevaTarjeta.vencimiento
      };
      this.tarjetasGuardadas.push(tarjeta);
      try {
        const userKey = `tarjetasGuardadas_${currentUser.id}`;
        localStorage.setItem(userKey, JSON.stringify(this.tarjetasGuardadas));
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

      // Generar el ticket PDF en base64 para guardarlo
      console.log('📄 Generando ticket PDF para guardar en BD...');
      const ticketBase64 = await this.ticketPdfService.generarTicketDulceria({
        numeroOrden: this.recibo.numeroOrden,
        fecha: this.recibo.fecha,
        hora: this.recibo.hora,
        tarjeta: this.recibo.tarjeta,
        items: this.recibo.items,
        total: this.recibo.total,
        pedidoId: this.recibo.pedidoId
      }, true); // soloGenerar = true para obtener base64
      
      console.log('✅ Ticket PDF generado');
      console.log('   Tipo:', typeof ticketBase64);
      console.log('   Tamaño:', ticketBase64?.length || 'undefined');
      console.log('   Primeros 100 chars:', ticketBase64?.substring(0, 100) || 'no hay datos');
      
      // Guardar el ticket en el pedido
      if (ticketBase64) {
        console.log('💾 Guardando ticket en el pedido...');
        try {
          const resultado = await this.pedidosService.updatePedido(pedido.id, {
            ticketData: ticketBase64
          }).toPromise();
          console.log(`✅ Guardado exitosamente en pedido ${pedido.id}`);
          console.log(`   Respuesta del servidor:`, resultado);
        } catch (error: any) {
          console.error(`❌ Error guardando ticket en pedido ${pedido.id}:`, error);
          console.error(`   Detalles del error:`, {
            message: error?.message,
            status: error?.status,
            error: error?.error
          });
        }
      } else {
        console.error('❌ ticketBase64 es undefined o vacío - NO se guardará ticket');
      }

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

  async descargarTicket(): Promise<void> {
    if (!this.recibo) return;

    await this.ticketPdfService.generarTicketDulceria({
      numeroOrden: this.recibo.numeroOrden,
      fecha: this.recibo.fecha,
      hora: this.recibo.hora,
      tarjeta: this.recibo.tarjeta,
      items: this.recibo.items,
      total: this.recibo.total,
      pedidoId: this.recibo.pedidoId
    });
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
