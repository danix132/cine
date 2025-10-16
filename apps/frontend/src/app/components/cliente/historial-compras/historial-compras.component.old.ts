import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../../services/pedidos.service';
import { BoletosService } from '../../../services/boletos.service';
import { AuthService } from '../../../services/auth.service';
import { Pedido, PedidoItem } from '../../../models/pedido.model';
import { Boleto } from '../../../models/boleto.model';

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
      const pedidos = await this.pedidosService.getMisPedidos(currentUser.id).toPromise();

      console.log('📦 Pedidos cargados:', pedidos);

      if (!pedidos || pedidos.length === 0) {
        this.historial = [];
        this.aplicarFiltros();
        return;
      }

      // Procesar pedidos y crear historial
      const historialTemp: HistorialItem[] = [];

      for (const pedido of pedidos) {
        if (pedido.items) {
          for (const item of pedido.items) {
            const precio = typeof item.precioUnitario === 'string' 
              ? parseFloat(item.precioUnitario) 
              : item.precioUnitario;
            
            const subtotal = item.subtotal 
              ? (typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal)
              : (precio * item.cantidad);

            const historialItem: HistorialItem = {
              id: item.id,
              tipo: item.tipo === 'BOLETO' ? 'BOLETO' : 'DULCERIA',
              fecha: new Date(pedido.createdAt),
              descripcion: item.descripcion || this.obtenerDescripcion(item),
              cantidad: item.cantidad,
              precio: precio,
              total: subtotal,
              estado: pedido.estado || 'COMPLETADO',
              canjeado: false, // Se actualizará después
              detalles: { pedido, item }
            };

            // Si es un boleto, obtener su estado de validación y código QR
            if (item.tipo === 'BOLETO') {
              try {
                const boleto = await this.boletosService.getBoleto(item.referenciaId).toPromise();
                if (boleto) {
                  historialItem.estado = boleto.estado;
                  historialItem.canjeado = boleto.estado === 'VALIDADO';
                  historialItem.codigoQR = boleto.codigoQR;
                  historialItem.qrCodeUrl = await this.generarQRCode(boleto.codigoQR);
                  historialItem.detalles.boleto = boleto;
                }
              } catch (error) {
                console.warn('⚠️ No se pudo cargar el boleto:', item.referenciaId);
              }
            }

            // Si es dulcería, también podríamos tener un código QR en el futuro
            if (item.tipo === 'DULCERIA') {
              // TODO: Implementar códigos QR para dulcería
              historialItem.canjeado = false;
            }

            // Si es dulcería, verificar si fue canjeado (por ahora siempre false)
            // TODO: Implementar lógica de validación de dulcería en el futuro
            if (item.tipo === 'DULCERIA') {
              historialItem.canjeado = false; // Por defecto no canjeado
            }

            historialTemp.push(historialItem);
          }
        }
      }

      // Ordenar por fecha descendente
      this.historial = historialTemp.sort((a, b) => 
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
    this.totalGastado = this.historial.reduce((sum, item) => sum + item.total, 0);
    
    this.totalBoletos = this.historial
      .filter(item => item.tipo === 'BOLETO')
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    this.totalDulceria = this.historial
      .filter(item => item.tipo === 'DULCERIA')
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    this.boletosValidados = this.historial
      .filter(item => item.tipo === 'BOLETO' && item.canjeado)
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    this.dulceriasCanjeadas = this.historial
      .filter(item => item.tipo === 'DULCERIA' && item.canjeado)
      .reduce((sum, item) => sum + item.cantidad, 0);
  }

  aplicarFiltros(): void {
    let resultado = [...this.historial];

    // Filtro por tipo
    if (this.filtroTipo !== 'TODOS') {
      resultado = resultado.filter(item => item.tipo === this.filtroTipo);
    }

    // Filtro por estado
    if (this.filtroEstado === 'CANJEADO') {
      resultado = resultado.filter(item => item.canjeado);
    } else if (this.filtroEstado === 'PENDIENTE') {
      resultado = resultado.filter(item => !item.canjeado);
    }

    // Filtro por búsqueda
    if (this.filtroBusqueda.trim()) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      resultado = resultado.filter(item =>
        item.descripcion.toLowerCase().includes(busqueda)
      );
    }

    this.historialFiltrado = resultado;
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
    return new Promise((resolve, reject) => {
      try {
        // Usar librería QRCode para generar el código QR
        const QRCode = (window as any).QRCode;
        
        if (!QRCode) {
          // Si no está disponible, generar usando una API pública
          const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(texto)}`;
          resolve(qrApiUrl);
          return;
        }

        // Crear un canvas temporal
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, texto, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }, (error: any) => {
          if (error) {
            console.error('Error generando QR:', error);
            // Fallback a API pública
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(texto)}`;
            resolve(qrApiUrl);
          } else {
            resolve(canvas.toDataURL());
          }
        });
      } catch (error) {
        console.error('Error en generarQRCode:', error);
        // Fallback a API pública
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(texto)}`;
        resolve(qrApiUrl);
      }
    });
  }

  mostrarQRModal(item: HistorialItem): void {
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
}
