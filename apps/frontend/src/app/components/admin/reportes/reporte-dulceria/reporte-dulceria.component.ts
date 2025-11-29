import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PedidosService } from '../../../../services/pedidos.service';

interface ReporteDulceria {
  id: string;
  numeroPedido: string;
  fecha: Date;
  productos: string;
  cantidad: number;
  total: number;
  estado: string;
  canal: 'WEB' | 'MOSTRADOR';
  cliente: string;
  clienteEmail: string;
  vendedor?: string;
  entregado: boolean;
}

@Component({
  selector: 'app-reporte-dulceria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reporte-dulceria.component.html',
  styleUrls: ['./reporte-dulceria.component.scss']
})
export class ReporteDulceriaComponent implements OnInit {
  // Pestañas
  vistaActual: 'web' | 'mostrador' | 'todos' = 'todos';
  
  // Datos
  pedidosWeb: ReporteDulceria[] = [];
  pedidosMostrador: ReporteDulceria[] = [];
  todosLosPedidos: ReporteDulceria[] = [];
  pedidosFiltrados: ReporteDulceria[] = [];
  
  // Filtros
  fechaDesde: string = '';
  fechaHasta: string = '';
  estadoFiltro: string = 'TODOS';
  busqueda: string = '';
  
  // Estadísticas
  estadisticas = {
    totalPedidos: 0,
    pedidosWeb: 0,
    pedidosMostrador: 0,
    ingresosWeb: 0,
    ingresosMostrador: 0,
    ingresosTotal: 0,
    productosVendidos: 0,
    pedidosEntregados: 0,
    pedidosPendientes: 0
  };
  
  // Estados
  isLoading = true;
  errorMessage = '';

  constructor(private pedidosService: PedidosService) {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    this.fechaHasta = hoy.toISOString().split('T')[0];
    this.fechaDesde = hace30Dias.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  async cargarPedidos(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Obtener todos los pedidos
      const response = await this.pedidosService.getPedidos({}).toPromise();
      const pedidos = response?.data || [];
      console.log('📊 Pedidos cargados:', pedidos);
      
      // Filtrar solo pedidos de dulcería (que tienen items de tipo DULCERIA)
      const pedidosDulceria = pedidos.filter((p: any) => 
        p.items && p.items.some((item: any) => item.tipo === 'DULCERIA')
      );
      
      // Procesar pedidos
      this.todosLosPedidos = pedidosDulceria.map((pedido: any) => this.procesarPedido(pedido));
      
      // Separar por canal
      this.pedidosWeb = this.todosLosPedidos.filter(p => p.canal === 'WEB');
      this.pedidosMostrador = this.todosLosPedidos.filter(p => p.canal === 'MOSTRADOR');
      
      // Calcular estadísticas
      this.calcularEstadisticas();
      
      // Aplicar filtros
      this.aplicarFiltros();
      
      this.isLoading = false;
    } catch (error) {
      console.error('❌ Error cargando pedidos:', error);
      this.errorMessage = 'Error al cargar los pedidos de dulcería';
      this.isLoading = false;
    }
  }

  procesarPedido(pedido: any): ReporteDulceria {
    const canal: 'WEB' | 'MOSTRADOR' = pedido.vendedorId ? 'MOSTRADOR' : 'WEB';
    
    // Filtrar solo items de dulcería
    const itemsDulceria = pedido.items.filter((item: any) => item.tipo === 'DULCERIA');
    const productos = itemsDulceria.map((item: any) => 
      `${item.cantidad}x ${item.descripcion || 'Producto'}`
    ).join(', ');
    
    const cantidadTotal = itemsDulceria.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    
    return {
      id: pedido.id,
      numeroPedido: pedido.numeroPedido,
      fecha: new Date(pedido.createdAt),
      productos,
      cantidad: cantidadTotal,
      total: parseFloat(pedido.total),
      estado: pedido.estado,
      canal,
      cliente: pedido.usuario?.nombre || 'Cliente No Registrado',
      clienteEmail: pedido.usuario?.email || 'N/A',
      vendedor: pedido.vendedor?.nombre || undefined,
      entregado: pedido.entregado || false
    };
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      totalPedidos: this.todosLosPedidos.length,
      pedidosWeb: this.pedidosWeb.length,
      pedidosMostrador: this.pedidosMostrador.length,
      ingresosWeb: this.pedidosWeb.reduce((sum, p) => sum + p.total, 0),
      ingresosMostrador: this.pedidosMostrador.reduce((sum, p) => sum + p.total, 0),
      ingresosTotal: this.todosLosPedidos.reduce((sum, p) => sum + p.total, 0),
      productosVendidos: this.todosLosPedidos.reduce((sum, p) => sum + p.cantidad, 0),
      pedidosEntregados: this.todosLosPedidos.filter(p => p.entregado).length,
      pedidosPendientes: this.todosLosPedidos.filter(p => !p.entregado).length
    };
  }

  cambiarVista(vista: 'web' | 'mostrador' | 'todos'): void {
    this.vistaActual = vista;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let pedidos: ReporteDulceria[] = [];
    
    // Filtrar por vista
    switch (this.vistaActual) {
      case 'web':
        pedidos = [...this.pedidosWeb];
        break;
      case 'mostrador':
        pedidos = [...this.pedidosMostrador];
        break;
      case 'todos':
        pedidos = [...this.todosLosPedidos];
        break;
    }
    
    // Filtrar por fecha
    if (this.fechaDesde) {
      const desde = new Date(this.fechaDesde);
      pedidos = pedidos.filter(p => p.fecha >= desde);
    }
    if (this.fechaHasta) {
      const hasta = new Date(this.fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      pedidos = pedidos.filter(p => p.fecha <= hasta);
    }
    
    // Filtrar por estado
    if (this.estadoFiltro !== 'TODOS') {
      if (this.estadoFiltro === 'ENTREGADO') {
        pedidos = pedidos.filter(p => p.entregado);
      } else if (this.estadoFiltro === 'PENDIENTE') {
        pedidos = pedidos.filter(p => !p.entregado);
      }
    }
    
    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const busq = this.busqueda.toLowerCase();
      pedidos = pedidos.filter(p =>
        p.numeroPedido.toLowerCase().includes(busq) ||
        p.cliente.toLowerCase().includes(busq) ||
        p.productos.toLowerCase().includes(busq)
      );
    }
    
    this.pedidosFiltrados = pedidos;
  }

  limpiarFiltros(): void {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    this.fechaHasta = hoy.toISOString().split('T')[0];
    this.fechaDesde = hace30Dias.toISOString().split('T')[0];
    this.estadoFiltro = 'TODOS';
    this.busqueda = '';
    this.aplicarFiltros();
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }

  getEstadoClass(entregado: boolean): string {
    return entregado ? 'estado-entregado' : 'estado-pendiente';
  }

  getCanalBadgeClass(canal: string): string {
    return canal === 'WEB' ? 'badge-web' : 'badge-mostrador';
  }

  exportarExcel(): void {
    console.log('📊 Exportar a Excel - Próximamente');
    // TODO: Implementar exportación a Excel
  }

  exportarPDF(): void {
    console.log('📄 Exportar a PDF - Próximamente');
    // TODO: Implementar exportación a PDF
  }

  // Métodos auxiliares para cálculos en template
  getTotalCantidad(): number {
    return this.pedidosFiltrados.reduce((sum, p) => sum + p.cantidad, 0);
  }

  getTotalIngresos(): number {
    return this.pedidosFiltrados.reduce((sum, p) => sum + p.total, 0);
  }

  getColspanValue(): number {
    return this.vistaActual !== 'web' ? 3 : 2;
  }
}
