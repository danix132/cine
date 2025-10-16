import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../services/pedidos.service';
import { BoletosService } from '../../../services/boletos.service';
import { AuthService } from '../../../services/auth.service';
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
    private router: Router
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
              // Para dulcería, consideramos "canjeado/entregado" si el pedido está COMPLETADO
              itemHistorial.estado = pedido.estado;
              itemHistorial.canjeado = pedido.estado === 'COMPLETADO';
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
        return 'badge-info';
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
        return 'Completado';
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
        <p class="qr-instrucciones">Muestra este código en la entrada del cine</p>
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

  async descargarTicket(pedido: PedidoHistorial): Promise<void> {
    console.log('📄 Generando ticket PDF para pedido:', pedido.numeroPedido);
    console.log('📦 Items del pedido:', pedido.items.map(i => ({
      tipo: i.tipo,
      descripcion: i.descripcion,
      tieneCodigoQR: !!i.codigoQR,
      codigoQR: i.codigoQR?.substring(0, 20) + '...'
    })));
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Configurar fuente
    doc.setFont('helvetica');

    // ====== ENCABEZADO ======
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234); // Color morado
    doc.text('TICKET DE COMPRA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('www.cineapp.com', pageWidth / 2, yPosition, { align: 'center' });
    
    // Línea separadora
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // ====== INFORMACIÓN DEL PEDIDO ======
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL PEDIDO', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Pedido: ${pedido.numeroPedido}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fecha: ${pedido.fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Hora: ${pedido.fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, yPosition);
    yPosition += 6;
    
    // Tipo de compra con icono
    const tipoTexto = pedido.tipo === 'WEB' ? 'Compra Web' : 'Compra en Mostrador';
    const tipoColor: [number, number, number] = pedido.tipo === 'WEB' ? [56, 239, 125] : [255, 193, 7];
    doc.setTextColor(...tipoColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Tipo: ${tipoTexto}`, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    yPosition += 6;
    if (pedido.metodoPago) {
      doc.text(`Método de Pago: ${pedido.metodoPago}`, 20, yPosition);
      yPosition += 6;
    }
    doc.text(`Estado: ${pedido.estado}`, 20, yPosition);

    // ====== PRODUCTOS ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('PRODUCTOS', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Agregar items
    for (let index = 0; index < pedido.items.length; index++) {
      const item = pedido.items[index];
      
      // Verificar si necesitamos una nueva página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Número y descripción
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${item.descripcion}`, 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Cantidad: ${item.cantidad} x $${item.precio.toFixed(2)}`, 20, yPosition);
      yPosition += 5;
      doc.text(`   Subtotal: $${item.subtotal.toFixed(2)}`, 20, yPosition);
      yPosition += 5;
      
      // Estado con color
      const estadoTexto = item.canjeado ? 'Canjeado' : 'Pendiente';
      const estadoColor: [number, number, number] = item.canjeado ? [34, 197, 94] : [234, 179, 8];
      doc.setTextColor(...estadoColor);
      doc.text(`   Estado: ${estadoTexto}`, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 5;
      
      // Código QR si existe
      if (item.codigoQR) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`   QR: ${item.codigoQR.substring(0, 30)}...`, 20, yPosition);
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;
      }
      
      // Generar y agregar QR visual si existe código QR
      if (item.codigoQR && item.tipo === 'BOLETO') {
        console.log('🔍 Generando QR para item:', {
          tipo: item.tipo,
          codigoQR: item.codigoQR,
          descripcion: item.descripcion
        });
        
        try {
          // Generar QR dinámicamente
          const qrDataUrl = await QRCode.toDataURL(item.codigoQR, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
          console.log('✅ QR generado exitosamente, longitud:', qrDataUrl.length);
          
          const qrSize = 30;
          doc.addImage(qrDataUrl, 'PNG', 25, yPosition, qrSize, qrSize);
          yPosition += qrSize + 3;
          
          console.log('✅ QR agregado al PDF en posición Y:', yPosition - qrSize - 3);
        } catch (error) {
          console.error('❌ Error generando QR:', error);
          console.warn('No se pudo generar o agregar el QR al PDF:', error);
        }
      } else {
        console.log('⚠️ Item sin QR:', {
          tipo: item.tipo,
          tieneCodigoQR: !!item.codigoQR,
          descripcion: item.descripcion
        });
      }
      
      yPosition += 3;
    }

    // ====== TOTAL ======
    yPosition += 5;
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPosition - 5, pageWidth - 40, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`TOTAL: $${pedido.total.toFixed(2)}`, pageWidth / 2, yPosition + 3, { align: 'center' });

    // ====== INFORMACIÓN ADICIONAL ======
    yPosition += 18;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    
    if (this.tieneBoletos(pedido)) {
      doc.text('BOLETOS INCLUIDOS', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Presenta tu codigo QR en la entrada del cine', 20, yPosition);
      yPosition += 8;
    }
    
    if (this.tieneDulceria(pedido)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(102, 126, 234);
      doc.text('PRODUCTOS DE DULCERIA INCLUIDOS', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Recogelos en el mostrador de dulceria', 20, yPosition);
      yPosition += 8;
    }

    // ====== FOOTER ======
    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Gracias por su compra!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Conserve este ticket como comprobante', pageWidth / 2, yPosition, { align: 'center' });

    // Línea decorativa final
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Guardar el PDF
    const fechaArchivo = pedido.fecha.toLocaleDateString('es-ES').replace(/\//g, '-');
    doc.save(`ticket-${pedido.numeroPedido}-${fechaArchivo}.pdf`);
    
    console.log('📄 Ticket PDF descargado:', pedido.numeroPedido);
  }
}
