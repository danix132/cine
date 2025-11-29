import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PedidosService } from '../../../services/pedidos.service';
import { BoletosService } from '../../../services/boletos.service';
import { AuthService } from '../../../services/auth.service';
import { TicketPdfService } from '../../../services/ticket-pdf.service';
import { Pedido, PedidoItem } from '../../../models/pedido.model';
import { Boleto } from '../../../models/boleto.model';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

interface PedidoHistorial {
  id: string;
  numeroPedido: string;
  fecha: Date;
  total: number;
  estado: string;
  tipo: string;
  metodoPago?: string;
  items: ItemHistorial[];
  pedidoCompleto: Pedido;
}

interface ItemHistorial {
  id: string;
  tipo: 'BOLETO' | 'DULCERIA';
  descripcion: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  codigoQR?: string;
  qrCodeUrl?: string;
  canjeado: boolean;
  estado?: string;
  detalles?: any;
}

@Component({
  selector: 'app-historial-compras',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.scss']
})
export class HistorialComprasComponent implements OnInit {
  pedidos: PedidoHistorial[] = [];
  pedidosFiltrados: PedidoHistorial[] = [];
  
  // Modal de ticket
  mostrarModalTicket = false;
  ticketActual: SafeResourceUrl | null = null;
  ticketActualRaw: string = '';
  numeroPedidoActual: string = '';
  
  // Filtros
  filtroTipo: 'TODOS' | 'BOLETO' | 'DULCERIA' = 'TODOS';
  filtroEstado: 'TODOS' | 'CANJEADO' | 'PENDIENTE' = 'TODOS';
  filtroBusqueda = '';
  
  // Estados
  isLoading = true;
  errorMessage = '';
  
  // Estadísticas
  totalGastado = 0;
  totalBoletos = 0;
  totalDulceria = 0;
  boletosValidados = 0;
  dulceriasCanjeadas = 0;
  totalPedidos = 0;

  constructor(
    private pedidosService: PedidosService,
    private boletosService: BoletosService,
    private authService: AuthService,
    private ticketPdfService: TicketPdfService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  async cargarHistorial(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      // Cargar pedidos del usuario
      const pedidosData = await this.pedidosService.getMisPedidos(currentUser.id).toPromise();

      console.log('📦 Pedidos cargados:', pedidosData);
      console.log('🔍 Verificando ticketData en pedidos:');
      pedidosData?.forEach((p: any, i: number) => {
        console.log(`   Pedido ${i}: ticketData = ${p.ticketData ? '✅ Presente' : '❌ Vacío'} (${p.ticketData?.length || 0} chars)`);
      });

      if (!pedidosData || pedidosData.length === 0) {
        this.pedidos = [];
        this.aplicarFiltros();
        return;
      }

      // Procesar pedidos completos (agrupados por pedido)
      const pedidosTemp: PedidoHistorial[] = [];

      for (const pedido of pedidosData) {
        const itemsHistorial: ItemHistorial[] = [];
        
        if (pedido.items) {
          for (const item of pedido.items) {
            const precio = typeof item.precioUnitario === 'string' 
              ? parseFloat(item.precioUnitario) 
              : item.precioUnitario;
            
            const subtotal = item.subtotal 
              ? (typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal)
              : (precio * item.cantidad);

            const itemHistorial: ItemHistorial = {
              id: item.id,
              tipo: item.tipo === 'BOLETO' ? 'BOLETO' : 'DULCERIA',
              descripcion: item.descripcion || this.obtenerDescripcion(item),
              cantidad: item.cantidad,
              precio: precio,
              subtotal: subtotal,
              canjeado: false,
              detalles: { item }
            };

            // Si es un boleto, obtener su estado de validación y código QR
            if (item.tipo === 'BOLETO') {
              try {
                const boleto = await this.boletosService.getBoleto(item.referenciaId).toPromise();
                if (boleto) {
                  itemHistorial.estado = boleto.estado;
                  itemHistorial.canjeado = boleto.estado === 'VALIDADO';
                  itemHistorial.codigoQR = boleto.codigoQR;
                  itemHistorial.qrCodeUrl = await this.generarQRCode(boleto.codigoQR);
                  itemHistorial.detalles.boleto = boleto;
                }
              } catch (error) {
                console.warn('⚠️ No se pudo cargar el boleto:', item.referenciaId);
              }
            } else if (item.tipo === 'DULCERIA') {
              // Para dulcería, el estado depende de si está entregado
              itemHistorial.estado = pedido.entregado ? 'ENTREGADO' : pedido.estado;
              itemHistorial.canjeado = pedido.entregado || false;
              // Generar código QR para dulcería usando el ID del pedido
              itemHistorial.codigoQR = `DULC-${pedido.id}`;
              itemHistorial.qrCodeUrl = await this.generarQRCode(`DULC-${pedido.id}`);
            }

            itemsHistorial.push(itemHistorial);
          }
        }

        // Crear el pedido agrupado
        const pedidoHistorial: PedidoHistorial = {
          id: pedido.id,
          numeroPedido: `#${pedido.id.substring(0, 8).toUpperCase()}`,
          fecha: new Date(pedido.createdAt),
          total: typeof pedido.total === 'string' ? parseFloat(pedido.total) : pedido.total,
          estado: pedido.estado || 'COMPLETADO',
          tipo: pedido.tipo,
          metodoPago: pedido.metodoPago,
          items: itemsHistorial,
          pedidoCompleto: pedido
        };

        pedidosTemp.push(pedidoHistorial);
      }

      // Ordenar por fecha descendente
      this.pedidos = pedidosTemp.sort((a, b) => 
        b.fecha.getTime() - a.fecha.getTime()
      );

      this.calcularEstadisticas();
      this.aplicarFiltros();

    } catch (error) {
      console.error('❌ Error al cargar historial:', error);
      this.errorMessage = 'Error al cargar el historial de compras';
    } finally {
      this.isLoading = false;
    }
  }

  calcularEstadisticas(): void {
    this.totalGastado = this.pedidos.reduce((sum: number, pedido: PedidoHistorial) => sum + pedido.total, 0);
    this.totalPedidos = this.pedidos.length;
    
    // Calcular totales de items
    this.totalBoletos = 0;
    this.totalDulceria = 0;
    this.boletosValidados = 0;
    this.dulceriasCanjeadas = 0;

    this.pedidos.forEach((pedido: PedidoHistorial) => {
      pedido.items.forEach((item: ItemHistorial) => {
        if (item.tipo === 'BOLETO') {
          this.totalBoletos += item.cantidad;
          if (item.canjeado) {
            this.boletosValidados += item.cantidad;
          }
        } else if (item.tipo === 'DULCERIA') {
          this.totalDulceria += item.cantidad;
          if (item.canjeado) {
            this.dulceriasCanjeadas += item.cantidad;
          }
        }
      });
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.pedidos];

    // Filtro por tipo
    if (this.filtroTipo !== 'TODOS') {
      resultado = resultado.filter((pedido: PedidoHistorial) =>
        pedido.items.some((item: ItemHistorial) => item.tipo === this.filtroTipo)
      );
    }

    // Filtro por estado
    if (this.filtroEstado === 'CANJEADO') {
      resultado = resultado.filter((pedido: PedidoHistorial) =>
        pedido.items.some((item: ItemHistorial) => item.canjeado)
      );
    } else if (this.filtroEstado === 'PENDIENTE') {
      resultado = resultado.filter((pedido: PedidoHistorial) =>
        pedido.items.some((item: ItemHistorial) => !item.canjeado && item.estado !== 'CANCELADO')
      );
    }

    // Filtro por búsqueda
    if (this.filtroBusqueda.trim()) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      resultado = resultado.filter((pedido: PedidoHistorial) =>
        pedido.numeroPedido.toLowerCase().includes(busqueda) ||
        pedido.items.some((item: ItemHistorial) => 
          item.descripcion.toLowerCase().includes(busqueda)
        )
      );
    }

    this.pedidosFiltrados = resultado;
  }

  obtenerDescripcion(item: PedidoItem): string {
    if (item.tipo === 'BOLETO') {
      return 'Boleto de cine';
    }
    return 'Producto de dulcería';
  }

  limpiarFiltros(): void {
    this.filtroTipo = 'TODOS';
    this.filtroEstado = 'TODOS';
    this.filtroBusqueda = '';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return this.filtroTipo !== 'TODOS' || 
           this.filtroEstado !== 'TODOS' || 
           this.filtroBusqueda.trim() !== '';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'VALIDADO':
        return 'badge-success';
      case 'PAGADO':
        return 'badge-primary';
      case 'RESERVADO':
        return 'badge-warning';
      case 'CANCELADO':
        return 'badge-danger';
      case 'COMPLETADO':
        return 'badge-primary'; // Usar azul para "Pagado"
      case 'ENTREGADO':
        return 'badge-success'; // Usar verde para "Entregado"
      default:
        return 'badge-secondary';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'VALIDADO':
        return 'Validado';
      case 'PAGADO':
        return 'Pagado';
      case 'RESERVADO':
        return 'Reservado';
      case 'CANCELADO':
        return 'Cancelado';
      case 'COMPLETADO':
        return 'Pagado'; // Mostrar "Pagado" en lugar de "Completado"
      case 'ENTREGADO':
        return 'Entregado';
      default:
        return estado;
    }
  }

  volver(): void {
    this.router.navigate(['/cliente']);
  }

  async generarQRCode(texto: string): Promise<string> {
    // Usar API pública para generar códigos QR
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(texto)}`;
    return qrApiUrl;
  }

  mostrarQRModal(item: ItemHistorial): void {
    if (!item.codigoQR) return;
    
    // Determinar instrucción según el tipo
    const instruccion = item.tipo === 'BOLETO' 
      ? 'Muestra este código en la entrada del cine'
      : 'Muestra este código en el mostrador de dulcería';
    
    // Crear modal para mostrar QR más grande
    const modal = document.createElement('div');
    modal.className = 'qr-modal-overlay';
    modal.innerHTML = `
      <div class="qr-modal-content">
        <button class="qr-modal-close">&times;</button>
        <h3>${item.descripcion}</h3>
        <div class="qr-code-large">
          <img src="${item.qrCodeUrl}" alt="Código QR" />
        </div>
        <p class="qr-code-text">${item.codigoQR}</p>
        <p class="qr-instrucciones">${instruccion}</p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera o en la X
    const closeBtn = modal.querySelector('.qr-modal-close');
    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // Métodos helper para el template
  getTotalItemsPedido(pedido: PedidoHistorial): number {
    return pedido.items.reduce((sum: number, item: ItemHistorial) => sum + item.cantidad, 0);
  }

  tieneBoletos(pedido: PedidoHistorial): boolean {
    return pedido.items.some((item: ItemHistorial) => item.tipo === 'BOLETO');
  }

  tieneDulceria(pedido: PedidoHistorial): boolean {
    return pedido.items.some((item: ItemHistorial) => item.tipo === 'DULCERIA');
  }

  estaEntregado(pedido: PedidoHistorial): boolean {
    // Solo devolver true si el pedido tiene dulcería Y está marcado como entregado
    return this.tieneDulceria(pedido) && 
           pedido.pedidoCompleto?.entregado === true;
  }

  getFechaEntrega(pedido: PedidoHistorial): Date | string | null {
    return pedido.pedidoCompleto?.fechaEntrega || null;
  }

  async descargarTicket(pedido: PedidoHistorial): Promise<void> {
    console.log('📄 Abriendo modal de ticket...');
    
    const itemsBoletos = pedido.items.filter(item => item.tipo === 'BOLETO');
    const itemsDulceria = pedido.items.filter(item => item.tipo === 'DULCERIA');
    
    // Verificar que tenga al menos boletos o dulcería
    if (itemsBoletos.length === 0 && itemsDulceria.length === 0) {
      alert('Este pedido no contiene items con ticket');
      return;
    }
    
    console.log('🔍 Pedido actual:', {
      numeroOrden: pedido.numeroPedido,
      items: pedido.items.length,
      tieneBoletos: itemsBoletos.length > 0,
      tieneDulceria: itemsDulceria.length > 0,
      tieneTicketGuardado: !!pedido.pedidoCompleto?.ticketData,
      ticketDataLength: pedido.pedidoCompleto?.ticketData?.length || 0
    });
    
    // Si hay ticket guardado en el pedido, mostrarlo en el modal (para dulcería o boletos)
    if (pedido.pedidoCompleto?.ticketData) {
      console.log('✅ Ticket encontrado en BD, abriendo modal...');
      this.ticketActualRaw = pedido.pedidoCompleto.ticketData;
      this.ticketActual = this.sanitizer.bypassSecurityTrustResourceUrl(pedido.pedidoCompleto.ticketData);
      this.numeroPedidoActual = pedido.numeroPedido;
      this.mostrarModalTicket = true;
      return;
    }
    
    // Si no hay ticket guardado en el pedido, buscar en los boletos
    if (itemsBoletos.length > 0 && itemsBoletos[0]?.detalles?.boleto?.ticketData) {
      console.log('✅ Ticket encontrado en boleto, abriendo modal...');
      this.ticketActualRaw = itemsBoletos[0].detalles.boleto.ticketData;
      this.ticketActual = this.sanitizer.bypassSecurityTrustResourceUrl(itemsBoletos[0].detalles.boleto.ticketData);
      this.numeroPedidoActual = pedido.numeroPedido;
      this.mostrarModalTicket = true;
      return;
    }
    
    console.log('⚠️ No hay ticket guardado para este pedido');
    alert('No hay ticket disponible para este pedido');
  }

  cerrarModalTicket(): void {
    this.mostrarModalTicket = false;
    this.ticketActual = null;
    this.ticketActualRaw = '';
    this.numeroPedidoActual = '';
  }

  descargarTicketDelModal(): void {
    if (!this.ticketActualRaw) return;
    
    try {
      const link = document.createElement('a');
      link.href = this.ticketActualRaw;
      link.download = `recibo-${this.numeroPedidoActual}.pdf`;
      link.click();
      console.log('✅ Ticket descargado exitosamente');
    } catch (error) {
      console.error('❌ Error al descargar ticket:', error);
      alert('Error al descargar el ticket');
    }
  }

  async generarPDFBoletos(pedido: PedidoHistorial, items: ItemHistorial[]): Promise<void> {
    // Tomar el primer boleto para obtener info de la película/función
    const primerItem = items[0];
    const boleto = primerItem?.detalles?.boleto;
    
    if (!boleto || !boleto.funcion) {
      console.error('No se encontró información de la función');
      alert('No se puede generar el ticket: información de función no disponible');
      return;
    }

    const funcion = boleto.funcion;
    const fecha = new Date(pedido.fecha);
    const fechaFuncion = new Date(funcion.inicio);
    const timestamp = new Date(pedido.pedidoCompleto.createdAt).getTime();
    const numeroOrden = 'BOL-' + timestamp.toString().slice(-8);
    
    // Generar QR con el código del primer boleto (todos comparten la misma compra)
    const qrCodeDataUrl = await QRCode.toDataURL(boleto.codigoQR, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    const totalBoletos = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tarjetaInfo = pedido.metodoPago === 'TARJETA' ? '**** ****' : pedido.metodoPago || 'No especificado';
    
    await this.ticketPdfService.generarTicketBoletos({
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
      tarjeta: tarjetaInfo,
      pelicula: {
        titulo: funcion.pelicula?.titulo || 'N/A',
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
        sala: funcion.sala?.nombre || 'N/A'
      },
      asientos: items.map(item => {
        const boletoItem = item.detalles?.boleto;
        return {
          fila: boletoItem?.asiento?.fila?.toString() || '?',
          numero: boletoItem?.asiento?.numero || 0
        };
      }),
      total: totalBoletos,
      qrCode: qrCodeDataUrl
    });
  }

  async generarPDFDulceria(pedido: PedidoHistorial, items: ItemHistorial[]): Promise<void> {
    // Usar exactamente el mismo formato que dulceria.component.ts
    const fecha = new Date(pedido.fecha);
    const totalDulceria = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Formatear fecha y hora EXACTAMENTE como en dulceria.component.ts
    const ahora = new Date(pedido.fecha);
    
    // Generar numeroOrden usando el timestamp del pedido (igual que en dulceria pero con la fecha original)
    const timestamp = new Date(pedido.pedidoCompleto.createdAt).getTime();
    const numeroOrden = 'DULC-' + timestamp.toString().slice(-8);
    
    // Obtener información de la tarjeta - usar el mismo formato que dulceria
    // En dulceria se guarda como "**** 1234", pero en el backend solo se guarda "TARJETA"
    // Por ahora usamos el metodoPago del pedido
    const tarjetaInfo = pedido.metodoPago === 'TARJETA' ? '**** ****' : pedido.metodoPago || 'No especificado';
    
    await this.ticketPdfService.generarTicketDulceria({
      numeroOrden: numeroOrden,
      fecha: ahora.toLocaleDateString('es-MX'),
      hora: ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      tarjeta: tarjetaInfo,
      items: items.map(item => ({
        nombre: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.subtotal
      })),
      total: totalDulceria,
      pedidoId: pedido.id  // Usar el ID directamente como string (UUID)
    });
  }
}
