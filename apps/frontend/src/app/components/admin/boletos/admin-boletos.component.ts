import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BoletosService } from '../../../services/boletos.service';
import { PedidosService } from '../../../services/pedidos.service';
import { TicketPdfService } from '../../../services/ticket-pdf.service';
import { Boleto } from '../../../models/boleto.model';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-admin-boletos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boletos.component.html',
  styleUrls: ['./admin-boletos.component.scss']
})
export class AdminBoletosComponent implements OnInit {
  // Vista actual
  vistaActual: 'boletos' | 'dulceria' = 'boletos';
  
  boletos: Boleto[] = [];
  boletosFiltrados: Boleto[] = [];
  loading = false;
  
  // Dulcería
  pedidosDulceria: any[] = [];
  pedidosDulceriaFiltrados: any[] = [];
  loadingDulceria = false;

  // Ticket viewer
  ticketActual: SafeResourceUrl | null = null;
  ticketActualRaw: string = '';
  modalAbierto: boolean = false;
  
  // Filtros Boletos
  filtroBusqueda = '';
  filtroFecha = '';
  
  // Filtros Dulcería
  filtroBusquedaDulceria = '';
  filtroFechaDulceria = '';
  
  // Paginación Boletos
  paginaActual = 1;
  itemsPorPagina = 20;
  totalPaginas = 1;

  // Paginación Dulcería
  paginaActualDulceria = 1;
  itemsPorPaginaDulceria = 20;
  totalPaginasDulceria = 1;

  constructor(
    private boletosService: BoletosService,
    private pedidosService: PedidosService,
    private sanitizer: DomSanitizer,
    private ticketPdfService: TicketPdfService
  ) {}

  ngOnInit(): void {
    this.cargarBoletos();
    this.cargarPedidosDulceria();
  }

  cambiarVista(vista: 'boletos' | 'dulceria'): void {
    this.vistaActual = vista;
  }

  cargarPedidosDulceria(): void {
    this.loadingDulceria = true;
    this.pedidosService.getPedidos({}).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta completa del backend:', response);
        
        // El backend retorna { pedidos, total, page, limit }
        const todosPedidos = response?.pedidos || response?.data || [];
        console.log('📋 Total de pedidos recibidos:', todosPedidos.length);
        
        // Filtrar solo pedidos que tengan items de dulcería
        this.pedidosDulceria = todosPedidos.filter((pedido: any) => {
          const tieneDulceria = pedido.items && pedido.items.some((item: any) => item.tipo === 'DULCERIA');
          if (tieneDulceria) {
            console.log('🍬 Pedido de dulcería encontrado:', {
              id: pedido.id,
              numeroPedido: pedido.numeroPedido,
              items: pedido.items.length,
              tieneTicket: !!pedido.ticketData,
              ticketLength: pedido.ticketData?.length || 0
            });
          }
          return tieneDulceria;
        });
        
        console.log('🍬 Pedidos de dulcería filtrados:', this.pedidosDulceria.length);
        
        // Verificar cuántos tienen tickets
        const conTicket = this.pedidosDulceria.filter((p: any) => p.ticketData);
        console.log(`📄 Pedidos con ticket: ${conTicket.length} de ${this.pedidosDulceria.length}`);
        
        if (this.pedidosDulceria.length > 0) {
          console.log('🔍 Primer pedido de dulcería:', this.pedidosDulceria[0]);
        }
        
        // Aplicar filtros después de cargar
        this.aplicarFiltrosDulceria();
        
        this.loadingDulceria = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar pedidos de dulcería:', error);
        this.loadingDulceria = false;
      }
    });
  }

  getTotalItems(items: any[]): number {
    if (!items) return 0;
    return items
      .filter((item: any) => item.tipo === 'DULCERIA')
      .reduce((sum: number, item: any) => sum + item.cantidad, 0);
  }

  getCanalBadgeClass(vendedorId: string | null): string {
    return vendedorId ? 'badge bg-danger' : 'badge bg-primary';
  }

  getEstadoPedidoBadgeClass(entregado: boolean): string {
    return entregado ? 'badge bg-success' : 'badge bg-warning';
  }

  actualizarDatos(): void {
    this.cargarBoletos();
    this.cargarPedidosDulceria();
  }

  cargarBoletos(): void {
    this.loading = true;
    this.boletosService.obtenerTodos().subscribe({
      next: (boletos) => {
        console.log('✅ Boletos cargados:', boletos);
        console.log('📊 Total de boletos:', boletos.length);
        if (boletos.length > 0) {
          console.log('🎫 Ejemplo de boleto completo:', boletos[0]);
          console.log('🎬 Función:', boletos[0].funcion);
          console.log('💺 Asiento:', boletos[0].asiento);
          console.log('👤 Usuario:', boletos[0].usuario);
        }
        this.boletos = boletos;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar boletos:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.boletos];

    // Filtro de búsqueda
    if (this.filtroBusqueda.trim()) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      resultado = resultado.filter(boleto => 
        boleto.codigoQR.toLowerCase().includes(busqueda) ||
        boleto.funcion?.pelicula?.titulo?.toLowerCase().includes(busqueda) ||
        boleto.usuario?.nombre?.toLowerCase().includes(busqueda) ||
        boleto.usuario?.email?.toLowerCase().includes(busqueda)
      );
    }

    // Filtro de fecha
    if (this.filtroFecha) {
      resultado = resultado.filter(boleto => {
        const fechaBoleto = new Date(boleto.createdAt).toISOString().split('T')[0];
        return fechaBoleto === this.filtroFecha;
      });
    }

    this.boletosFiltrados = resultado;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.boletosFiltrados.length / this.itemsPorPagina);
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }
  }

  get boletosPaginados(): Boleto[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.boletosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroFecha = '';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroFecha);
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string | Date): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearPrecio(precio: number | string): string {
    const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio;
    return `$${precioNum.toFixed(2)}`;
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'PAGADO': return 'bg-success';
      case 'VALIDADO': return 'bg-info';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5;
    
    if (this.totalPaginas <= maxPaginas) {
      for (let i = 1; i <= this.totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (this.paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) {
          paginas.push(i);
        }
        paginas.push(-1);
        paginas.push(this.totalPaginas);
      } else if (this.paginaActual >= this.totalPaginas - 2) {
        paginas.push(1);
        paginas.push(-1);
        for (let i = this.totalPaginas - 3; i <= this.totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(1);
        paginas.push(-1);
        for (let i = this.paginaActual - 1; i <= this.paginaActual + 1; i++) {
          paginas.push(i);
        }
        paginas.push(-1);
        paginas.push(this.totalPaginas);
      }
    }
    
    return paginas;
  }

  async verTicketBoleto(boleto: Boleto): Promise<void> {
    try {
      let ticketData = boleto.ticketData;
      
      // Si no tiene ticketData guardado, generarlo on-demand
      if (!ticketData) {
        console.log('⚠️ Boleto sin ticketData, generando PDF...');
        
        const fecha = new Date(boleto.createdAt);
        const timestamp = fecha.getTime();
        const numeroOrden = 'BOL-' + timestamp.toString().slice(-8);
        
        // Generar QR con el código del boleto
        const qrCodeDataUrl = await QRCode.toDataURL(boleto.codigoQR, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        const fechaFuncion = new Date(boleto.funcion?.inicio || '');
        
        // Generar el PDF usando el servicio
        ticketData = await this.ticketPdfService.generarTicketBoletos({
          numeroOrden: numeroOrden,
          fecha: fecha.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          hora: fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          tarjeta: boleto.usuario ? '**** ****' : 'Efectivo',
          pelicula: {
            titulo: boleto.funcion?.pelicula?.titulo || 'N/A',
            fechaFuncion: fechaFuncion.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            horaFuncion: fechaFuncion.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            sala: boleto.funcion?.sala?.nombre || 'N/A'
          },
          asientos: [{
            fila: boleto.asiento?.fila?.toString() || '?',
            numero: boleto.asiento?.numero || 0
          }],
          total: Number(boleto.funcion?.precio || 0),
          qrCode: qrCodeDataUrl
        }, true) as string; // true = solo generar, no descargar
        
        console.log('✅ Ticket PDF generado on-demand');
      }
      
      this.ticketActualRaw = ticketData;
      this.ticketActual = this.sanitizer.bypassSecurityTrustResourceUrl(ticketData);
      this.modalAbierto = true;
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('❌ Error al generar/mostrar ticket:', error);
      alert('Error al mostrar el ticket');
    }
  }

  async verTicketDulceria(pedido: any): Promise<void> {
    try {
      let ticketData = pedido.ticketData;
      
      // Si no tiene ticketData guardado, generarlo on-demand
      if (!ticketData) {
        console.log('⚠️ Pedido sin ticketData, generando PDF...');
        
        const fecha = new Date(pedido.createdAt);
        const timestamp = fecha.getTime();
        const numeroOrden = 'DULC-' + timestamp.toString().slice(-8);
        
        // Determinar si incluir QR (solo para pedidos WEB)
        const incluirQR = pedido.tipo === 'WEB' || !pedido.vendedorId;
        
        // Generar el PDF usando el servicio
        ticketData = await this.ticketPdfService.generarTicketDulceria({
          numeroOrden: numeroOrden,
          fecha: fecha.toLocaleDateString('es-MX'),
          hora: fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          tarjeta: pedido.vendedorId ? 'Efectivo' : '**** ****',
          items: pedido.items.map((item: any) => ({
            nombre: item.descripcion || 'Producto',
            cantidad: item.cantidad,
            precioUnitario: Number(item.precio),
            subtotal: Number(item.subtotal)
          })),
          total: Number(pedido.total),
          pedidoId: pedido.id,
          incluirQR: incluirQR
        }, true) as string; // true = solo generar, no descargar
        
        console.log('✅ Ticket PDF de dulcería generado on-demand');
      }
      
      this.ticketActualRaw = ticketData;
      this.ticketActual = this.sanitizer.bypassSecurityTrustResourceUrl(ticketData);
      this.modalAbierto = true;
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('❌ Error al generar/mostrar ticket de dulcería:', error);
      alert('Error al mostrar el ticket');
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.ticketActual = null;
    this.ticketActualRaw = '';
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  descargarTicketDelModal(): void {
    if (!this.ticketActualRaw) return;

    const link = document.createElement('a');
    link.href = this.ticketActualRaw;
    link.download = `ticket-${Date.now()}.pdf`;
    link.click();
  }

  // Métodos de filtrado y paginación para Dulcería
  aplicarFiltrosDulceria(): void {
    let resultado = [...this.pedidosDulceria];

    // Filtro de búsqueda
    if (this.filtroBusquedaDulceria.trim()) {
      const busqueda = this.filtroBusquedaDulceria.toLowerCase();
      resultado = resultado.filter(pedido => 
        pedido.numeroPedido?.toLowerCase().includes(busqueda) ||
        pedido.usuario?.nombre?.toLowerCase().includes(busqueda) ||
        pedido.usuario?.email?.toLowerCase().includes(busqueda) ||
        pedido.items?.some((item: any) => 
          item.descripcion?.toLowerCase().includes(busqueda)
        )
      );
    }

    // Filtro de fecha
    if (this.filtroFechaDulceria) {
      resultado = resultado.filter(pedido => {
        const fechaPedido = new Date(pedido.createdAt).toISOString().split('T')[0];
        return fechaPedido === this.filtroFechaDulceria;
      });
    }

    this.pedidosDulceriaFiltrados = resultado;
    this.calcularPaginacionDulceria();
  }

  calcularPaginacionDulceria(): void {
    this.totalPaginasDulceria = Math.ceil(this.pedidosDulceriaFiltrados.length / this.itemsPorPaginaDulceria);
    if (this.paginaActualDulceria > this.totalPaginasDulceria) {
      this.paginaActualDulceria = 1;
    }
  }

  get pedidosDulceriaPaginados(): any[] {
    const inicio = (this.paginaActualDulceria - 1) * this.itemsPorPaginaDulceria;
    const fin = inicio + this.itemsPorPaginaDulceria;
    return this.pedidosDulceriaFiltrados.slice(inicio, fin);
  }

  cambiarPaginaDulceria(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginasDulceria) {
      this.paginaActualDulceria = pagina;
    }
  }

  limpiarFiltrosDulceria(): void {
    this.filtroBusquedaDulceria = '';
    this.filtroFechaDulceria = '';
    this.aplicarFiltrosDulceria();
  }

  hayFiltrosActivosDulceria(): boolean {
    return !!(this.filtroBusquedaDulceria || this.filtroFechaDulceria);
  }

  getPaginasDulceria(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5;
    
    if (this.totalPaginasDulceria <= maxPaginas) {
      for (let i = 1; i <= this.totalPaginasDulceria; i++) {
        paginas.push(i);
      }
    } else {
      if (this.paginaActualDulceria <= 3) {
        for (let i = 1; i <= 4; i++) {
          paginas.push(i);
        }
        paginas.push(-1);
        paginas.push(this.totalPaginasDulceria);
      } else if (this.paginaActualDulceria >= this.totalPaginasDulceria - 2) {
        paginas.push(1);
        paginas.push(-1);
        for (let i = this.totalPaginasDulceria - 3; i <= this.totalPaginasDulceria; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(1);
        paginas.push(-1);
        for (let i = this.paginaActualDulceria - 1; i <= this.paginaActualDulceria + 1; i++) {
          paginas.push(i);
        }
        paginas.push(-1);
        paginas.push(this.totalPaginasDulceria);
      }
    }
    
    return paginas;
  }
}
