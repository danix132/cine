import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BoletosService } from '../../../../services/boletos.service';
import { PedidosService } from '../../../../services/pedidos.service';

interface ReporteBoleto {
  id: string;
  codigoQR: string;
  fecha: Date;
  pelicula: string;
  sala: string;
  funcion: string;
  asiento: string;
  precio: number;
  estado: string;
  canal: 'WEB' | 'MOSTRADOR';
  cliente: string;
  clienteEmail: string;
  vendedor?: string;
}

@Component({
  selector: 'app-reporte-boletos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reporte-boletos.component.html',
  styleUrls: ['./reporte-boletos.component.scss']
})
export class ReporteBoletosComponent implements OnInit {
  // Pestañas
  vistaActual: 'web' | 'mostrador' | 'todos' = 'todos';
  
  // Datos
  boletosWeb: ReporteBoleto[] = [];
  boletosMostrador: ReporteBoleto[] = [];
  todosLosBoletos: ReporteBoleto[] = [];
  boletosFiltrados: ReporteBoleto[] = [];
  
  // Filtros
  fechaDesde: string = '';
  fechaHasta: string = '';
  estadoFiltro: string = 'TODOS';
  busqueda: string = '';
  
  // Estadísticas
  estadisticas = {
    totalBoletos: 0,
    boletosWeb: 0,
    boletosMostrador: 0,
    ingresosWeb: 0,
    ingresosMostrador: 0,
    ingresosTotal: 0,
    boletosValidados: 0,
    boletosPendientes: 0
  };
  
  // Estados
  isLoading = true;
  errorMessage = '';

  constructor(
    private boletosService: BoletosService,
    private pedidosService: PedidosService
  ) {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    this.fechaHasta = hoy.toISOString().split('T')[0];
    this.fechaDesde = hace30Dias.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarBoletos();
  }

  async cargarBoletos(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Obtener todos los boletos
      const response = await this.boletosService.getBoletos({}).toPromise();
      const boletos = response?.data || [];
      console.log('📊 Boletos cargados:', boletos);
      
      // Procesar boletos
      this.todosLosBoletos = await Promise.all(
        boletos.map(async (boleto: any) => await this.procesarBoleto(boleto))
      );
      
      // Separar por canal
      this.boletosWeb = this.todosLosBoletos.filter(b => b.canal === 'WEB');
      this.boletosMostrador = this.todosLosBoletos.filter(b => b.canal === 'MOSTRADOR');
      
      // Calcular estadísticas
      this.calcularEstadisticas();
      
      // Aplicar filtros
      this.aplicarFiltros();
      
      this.isLoading = false;
    } catch (error) {
      console.error('❌ Error cargando boletos:', error);
      this.errorMessage = 'Error al cargar los boletos';
      this.isLoading = false;
    }
  }

  async procesarBoleto(boleto: any): Promise<ReporteBoleto> {
    const canal: 'WEB' | 'MOSTRADOR' = boleto.vendedorId ? 'MOSTRADOR' : 'WEB';
    
    return {
      id: boleto.id,
      codigoQR: boleto.codigoQR,
      fecha: new Date(boleto.createdAt),
      pelicula: boleto.funcion?.pelicula?.titulo || 'N/A',
      sala: boleto.funcion?.sala?.nombre || 'N/A',
      funcion: boleto.funcion?.inicio ? new Date(boleto.funcion.inicio).toLocaleString('es-MX') : 'N/A',
      asiento: boleto.asiento?.numeroAsiento || 'N/A',
      precio: parseFloat(boleto.funcion?.precio || '0'),
      estado: boleto.estado,
      canal,
      cliente: boleto.usuario?.nombre || 'Cliente No Registrado',
      clienteEmail: boleto.usuario?.email || 'N/A',
      vendedor: boleto.vendedor?.nombre || undefined
    };
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      totalBoletos: this.todosLosBoletos.length,
      boletosWeb: this.boletosWeb.length,
      boletosMostrador: this.boletosMostrador.length,
      ingresosWeb: this.boletosWeb.reduce((sum, b) => sum + b.precio, 0),
      ingresosMostrador: this.boletosMostrador.reduce((sum, b) => sum + b.precio, 0),
      ingresosTotal: this.todosLosBoletos.reduce((sum, b) => sum + b.precio, 0),
      boletosValidados: this.todosLosBoletos.filter(b => b.estado === 'VALIDADO').length,
      boletosPendientes: this.todosLosBoletos.filter(b => b.estado === 'COMPRADO').length
    };
  }

  cambiarVista(vista: 'web' | 'mostrador' | 'todos'): void {
    this.vistaActual = vista;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let boletos: ReporteBoleto[] = [];
    
    // Filtrar por vista
    switch (this.vistaActual) {
      case 'web':
        boletos = [...this.boletosWeb];
        break;
      case 'mostrador':
        boletos = [...this.boletosMostrador];
        break;
      case 'todos':
        boletos = [...this.todosLosBoletos];
        break;
    }
    
    // Filtrar por fecha
    if (this.fechaDesde) {
      const desde = new Date(this.fechaDesde);
      boletos = boletos.filter(b => b.fecha >= desde);
    }
    if (this.fechaHasta) {
      const hasta = new Date(this.fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      boletos = boletos.filter(b => b.fecha <= hasta);
    }
    
    // Filtrar por estado
    if (this.estadoFiltro !== 'TODOS') {
      boletos = boletos.filter(b => b.estado === this.estadoFiltro);
    }
    
    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const busq = this.busqueda.toLowerCase();
      boletos = boletos.filter(b =>
        b.pelicula.toLowerCase().includes(busq) ||
        b.cliente.toLowerCase().includes(busq) ||
        b.codigoQR.toLowerCase().includes(busq) ||
        b.sala.toLowerCase().includes(busq)
      );
    }
    
    this.boletosFiltrados = boletos;
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

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'VALIDADO':
        return 'estado-validado';
      case 'COMPRADO':
        return 'estado-pendiente';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return '';
    }
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
  getTotalIngresos(): number {
    return this.boletosFiltrados.reduce((sum, b) => sum + b.precio, 0);
  }

  getColspanValue(): number {
    return this.vistaActual !== 'web' ? 4 : 3;
  }
}
