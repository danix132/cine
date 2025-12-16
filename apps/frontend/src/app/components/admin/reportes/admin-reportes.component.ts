import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  ReportesService, 
  ReporteVentas, 
  ReporteOcupacion, 
  ReporteTopPeliculas, 
  ReporteVentasPorVendedor,
  ReporteVentasDulceria,
  ReporteVentasPorCanal,
  ReporteDescuentos,
  ReporteHorariosPico,
  ReporteIngresosPorPelicula,
  ReporteDashboardKPIs,
  ReporteSerieTemporal
} from '../../../services/reportes.service';
import { AuthService } from '../../../services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.scss']
})
export class AdminReportesComponent implements OnInit {
  reporteForm: FormGroup;
  reporteActual: string = '';
  cargando = false;
  error: string = '';
  tienePermisos = false;
  mensajeError = '';

  // Datos de reportes básicos
  reporteVentas: ReporteVentas | null = null;
  reporteOcupacion: ReporteOcupacion | null = null;
  reporteTopPeliculas: ReporteTopPeliculas | null = null;
  reporteVentasPorVendedor: ReporteVentasPorVendedor | null = null;
  reporteVentasDulceria: ReporteVentasDulceria | null = null;
  
  // Datos de reportes avanzados
  reporteVentasPorCanal: ReporteVentasPorCanal | null = null;
  reporteDescuentos: ReporteDescuentos | null = null;
  reporteHorariosPico: ReporteHorariosPico | null = null;
  reporteIngresosPorPelicula: ReporteIngresosPorPelicula | null = null;
  reporteDashboardKPIs: ReporteDashboardKPIs | null = null;
  reporteSerieTemporal: ReporteSerieTemporal | null = null;

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.reporteForm = this.fb.group({
      desde: ['', Validators.required],
      hasta: ['', Validators.required],
      tipoReporte: ['serie-temporal', Validators.required],
      limite: [10]
    });
    
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    console.log('📅 FRONTEND: Configurando fechas por defecto:', {
      hoy: hoy,
      hace30Dias: hace30Dias,
      hoySolo: hoy.toISOString().split('T')[0],
      hace30DiasSolo: hace30Dias.toISOString().split('T')[0]
    });
    
    this.reporteForm.patchValue({
      desde: hace30Dias.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0]
    });
  }

  ngOnInit(): void {
    this.verificarPermisos();
  }

  verificarPermisos(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || usuario.rol !== 'ADMIN') {
      this.tienePermisos = false;
      this.mensajeError = 'No tienes permisos para acceder a esta sección. Solo los administradores pueden ver reportes.';
    } else {
      this.tienePermisos = true;
    }
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  volverAlAdmin(): void {
    this.router.navigate(['/admin']);
  }

  generarReporte(): void {
    if (!this.reporteForm.valid) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    const formData = this.reporteForm.value;
    this.reporteActual = formData.tipoReporte;
    this.cargando = true;
    this.error = '';

    // Limpiar reportes anteriores
    this.limpiarReportes();

    switch (formData.tipoReporte) {
      case 'dashboard-kpis':
        this.generarReporteDashboardKPIs(formData.desde, formData.hasta);
        break;
      case 'serie-temporal':
        this.generarReporteSerieTemporal(formData.desde, formData.hasta);
        break;
      case 'ventas':
        this.generarReporteVentas(formData.desde, formData.hasta);
        break;
      case 'ocupacion':
        this.generarReporteOcupacion(formData.desde, formData.hasta);
        break;
      case 'top-peliculas':
        this.generarReporteTopPeliculas(formData.desde, formData.hasta, formData.limite);
        break;
      case 'ventas-por-vendedor':
        this.generarReporteVentasPorVendedor(formData.desde, formData.hasta);
        break;
      case 'ventas-dulceria':
        this.generarReporteVentasDulceria(formData.desde, formData.hasta);
        break;
      case 'ventas-por-canal':
        this.generarReporteVentasPorCanal(formData.desde, formData.hasta);
        break;
      case 'descuentos-promociones':
        this.generarReporteDescuentos(formData.desde, formData.hasta);
        break;
      case 'horarios-pico':
        this.generarReporteHorariosPico(formData.desde, formData.hasta);
        break;
      case 'ingresos-por-pelicula':
        this.generarReporteIngresosPorPelicula(formData.desde, formData.hasta);
        break;
      default:
        this.error = 'Tipo de reporte no válido';
        this.cargando = false;
    }
  }

  private limpiarReportes(): void {
    this.reporteVentas = null;
    this.reporteOcupacion = null;
    this.reporteTopPeliculas = null;
    this.reporteVentasPorVendedor = null;
    this.reporteVentasDulceria = null;
    this.reporteVentasPorCanal = null;
    this.reporteDescuentos = null;
    this.reporteHorariosPico = null;
    this.reporteIngresosPorPelicula = null;
    this.reporteDashboardKPIs = null;
    this.reporteSerieTemporal = null;
  }

  private generarReporteVentas(desde: string, hasta: string): void {
    console.log('🔍 FRONTEND: Generando reporte de ventas con fechas:', { desde, hasta });
    console.log('📅 FRONTEND: Fecha actual del navegador:', new Date());
    
    this.reportesService.getReporteVentas(desde, hasta).subscribe({
      next: (data: ReporteVentas) => {
        console.log('✅ FRONTEND: Reporte de ventas recibido:', data);
        this.reporteVentas = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ventas:', error);
        this.error = 'Error al generar el reporte de ventas';
        this.cargando = false;
      }
    });
  }

  private generarReporteOcupacion(desde: string, hasta: string): void {
    this.reportesService.getReporteOcupacion(desde, hasta).subscribe({
      next: (data: ReporteOcupacion) => {
        this.reporteOcupacion = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ocupación:', error);
        this.error = 'Error al generar el reporte de ocupación';
        this.cargando = false;
      }
    });
  }

  private generarReporteTopPeliculas(desde: string, hasta: string, limite: number): void {
    this.reportesService.getReporteTopPeliculas(desde, hasta, limite).subscribe({
      next: (data: ReporteTopPeliculas) => {
        this.reporteTopPeliculas = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de top películas:', error);
        this.error = 'Error al generar el reporte de top películas';
        this.cargando = false;
      }
    });
  }

  private generarReporteVentasPorVendedor(desde: string, hasta: string): void {
    this.reportesService.getReporteVentasPorVendedor(desde, hasta).subscribe({
      next: (data: ReporteVentasPorVendedor) => {
        this.reporteVentasPorVendedor = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ventas por vendedor:', error);
        this.error = 'Error al generar el reporte de ventas por vendedor';
        this.cargando = false;
      }
    });
  }

  private generarReporteVentasDulceria(desde: string, hasta: string): void {
    this.reportesService.getReporteVentasDulceria(desde, hasta).subscribe({
      next: (data: ReporteVentasDulceria) => {
        this.reporteVentasDulceria = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ventas de dulcería:', error);
        this.error = 'Error al generar el reporte de ventas de dulcería';
        this.cargando = false;
      }
    });
  }

  private generarReporteDashboardKPIs(desde: string, hasta: string): void {
    this.reportesService.getReporteDashboardKPIs(desde, hasta).subscribe({
      next: (data: ReporteDashboardKPIs) => {
        this.reporteDashboardKPIs = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando dashboard KPIs:', error);
        this.error = 'Error al generar el dashboard de KPIs';
        this.cargando = false;
      }
    });
  }

  private generarReporteSerieTemporal(desde: string, hasta: string): void {
    this.reportesService.getReporteSerieTemporal(desde, hasta).subscribe({
      next: (data: ReporteSerieTemporal) => {
        this.reporteSerieTemporal = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando serie temporal:', error);
        this.error = 'Error al generar la serie temporal';
        this.cargando = false;
      }
    });
  }

  private generarReporteVentasPorCanal(desde: string, hasta: string): void {
    this.reportesService.getReporteVentasPorCanal(desde, hasta).subscribe({
      next: (data: ReporteVentasPorCanal) => {
        this.reporteVentasPorCanal = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ventas por canal:', error);
        this.error = 'Error al generar el reporte de ventas por canal';
        this.cargando = false;
      }
    });
  }

  private generarReporteDescuentos(desde: string, hasta: string): void {
    this.reportesService.getReporteDescuentos(desde, hasta).subscribe({
      next: (data: ReporteDescuentos) => {
        this.reporteDescuentos = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de descuentos:', error);
        this.error = 'Error al generar el reporte de descuentos';
        this.cargando = false;
      }
    });
  }

  private generarReporteHorariosPico(desde: string, hasta: string): void {
    this.reportesService.getReporteHorariosPico(desde, hasta).subscribe({
      next: (data: ReporteHorariosPico) => {
        this.reporteHorariosPico = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de horarios pico:', error);
        this.error = 'Error al generar el reporte de horarios pico';
        this.cargando = false;
      }
    });
  }

  private generarReporteIngresosPorPelicula(desde: string, hasta: string): void {
    this.reportesService.getReporteIngresosPorPelicula(desde, hasta).subscribe({
      next: (data: ReporteIngresosPorPelicula) => {
        this.reporteIngresosPorPelicula = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error generando reporte de ingresos por película:', error);
        this.error = 'Error al generar el reporte de ingresos por película';
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }

  exportarExcel(): void {
    if (!this.reporteActual) {
      console.warn('⚠️ No hay reporte actual para exportar');
      return;
    }

    let data: any[] = [];
    let filename = '';
    let sheetName = '';

    console.log('📊 Exportando reporte:', this.reporteActual);

    switch (this.reporteActual) {
      case 'dashboard-kpis':
        if (this.reporteDashboardKPIs) {
          data = this.generarDatosDashboardKPIs();
          filename = 'reporte-dashboard-kpis.xlsx';
          sheetName = 'Dashboard KPIs';
        }
        break;
      case 'serie-temporal':
        if (this.reporteSerieTemporal) {
          data = this.generarDatosSerieTemporal();
          filename = 'reporte-serie-temporal.xlsx';
          sheetName = 'Serie Temporal';
        }
        break;
      case 'ventas':
        if (this.reporteVentas) {
          data = this.generarDatosVentas();
          filename = 'reporte-ventas.xlsx';
          sheetName = 'Ventas';
        }
        break;
      case 'ocupacion':
        if (this.reporteOcupacion) {
          data = this.generarDatosOcupacion();
          filename = 'reporte-ocupacion.xlsx';
          sheetName = 'Ocupación';
        }
        break;
      case 'top-peliculas':
        if (this.reporteTopPeliculas) {
          data = this.generarDatosTopPeliculas();
          filename = 'reporte-top-peliculas.xlsx';
          sheetName = 'Top Películas';
        }
        break;
      case 'ventas-por-vendedor':
        if (this.reporteVentasPorVendedor) {
          data = this.generarDatosVentasPorVendedor();
          filename = 'reporte-ventas-por-vendedor.xlsx';
          sheetName = 'Ventas por Vendedor';
        }
        break;
      case 'ventas-dulceria':
        if (this.reporteVentasDulceria) {
          data = this.generarDatosVentasDulceria();
          filename = 'reporte-ventas-dulceria.xlsx';
          sheetName = 'Ventas Dulcería';
        }
        break;
      case 'ventas-por-canal':
        if (this.reporteVentasPorCanal) {
          data = this.generarDatosVentasPorCanal();
          filename = 'reporte-ventas-por-canal.xlsx';
          sheetName = 'Ventas por Canal';
        }
        break;
      case 'descuentos-promociones':
        if (this.reporteDescuentos) {
          data = this.generarDatosDescuentos();
          filename = 'reporte-descuentos.xlsx';
          sheetName = 'Descuentos';
        }
        break;
      case 'horarios-pico':
        if (this.reporteHorariosPico) {
          data = this.generarDatosHorariosPico();
          filename = 'reporte-horarios-pico.xlsx';
          sheetName = 'Horarios Pico';
        }
        break;
      case 'ingresos-por-pelicula':
        if (this.reporteIngresosPorPelicula) {
          data = this.generarDatosIngresosPorPelicula();
          filename = 'reporte-ingresos-pelicula.xlsx';
          sheetName = 'Ingresos por Película';
        }
        break;
      default:
        console.warn('⚠️ Tipo de reporte no soportado:', this.reporteActual);
        this.error = 'Este tipo de reporte aún no soporta exportación a Excel';
        return;
    }

    if (data.length > 0) {
      console.log('✅ Descargando Excel con', data.length, 'filas');
      this.descargarExcel(data, filename, sheetName);
    } else {
      console.warn('⚠️ No hay datos para exportar');
      this.error = 'No hay datos disponibles para exportar';
    }
  }

  private generarDatosVentas(): any[] {
    if (!this.reporteVentas) return [];
    
    const promedioPorPedido = this.reporteVentas.cantidadPedidos > 0 
      ? this.reporteVentas.totalVentas / this.reporteVentas.cantidadPedidos 
      : 0;
    
    const datos = [
      // Header principal
      ['═══════════════════════════════════════════════════════════════'],
      ['                    📊 REPORTE DE VENTAS                        '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 INFORMACIÓN DEL PERÍODO'],
      [''],
      ['Fecha Inicio:', this.formatearFecha(this.reporteVentas.periodo.desde)],
      ['Fecha Fin:', this.formatearFecha(this.reporteVentas.periodo.hasta)],
      ['Fecha de Generación:', new Date().toLocaleString('es-MX')],
      [''],
      ['💰 RESUMEN FINANCIERO'],
      [''],
      ['Total de Ventas:', this.formatearMoneda(this.reporteVentas.totalVentas)],
      ['Cantidad de Pedidos:', this.reporteVentas.cantidadPedidos],
      ['Promedio por Pedido:', this.formatearMoneda(promedioPorPedido)],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['📋 DETALLE DE VENTAS'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      // Headers de la tabla con íconos
      ['📅 Fecha', '👤 Cliente', '🛒 Vendedor', '💵 Total', '🎫 Tipo']
    ];
    
    // Agregar los datos
    this.reporteVentas.ventas.forEach((venta: any) => {
      datos.push([
        this.formatearFecha(venta.createdAt),
        venta.usuario?.nombre || 'Cliente No Registrado',
        venta.vendedor?.nombre || 'Venta en Línea',
        this.formatearMoneda(venta.total),
        venta.tipo || 'CLIENTE'
      ]);
    });
    
    // Footer con totales
    datos.push(['']);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    datos.push(['TOTAL GENERAL', '', '', this.formatearMoneda(this.reporteVentas.totalVentas), '']);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    
    return datos;
  }

  private generarDatosOcupacion(): any[] {
    if (!this.reporteOcupacion) return [];
    
    const promedioOcupacion = this.calcularPromedioOcupacion();
    
    const datos = [
      // Header principal
      ['═══════════════════════════════════════════════════════════════'],
      ['                 🎬 REPORTE DE OCUPACIÓN DE SALAS               '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 INFORMACIÓN DEL PERÍODO'],
      [''],
      ['Fecha Inicio:', this.formatearFecha(this.reporteOcupacion.periodo.desde)],
      ['Fecha Fin:', this.formatearFecha(this.reporteOcupacion.periodo.hasta)],
      ['Fecha de Generación:', new Date().toLocaleString('es-MX')],
      [''],
      ['📊 RESUMEN DE OCUPACIÓN'],
      [''],
      ['Total de Funciones:', this.reporteOcupacion.totalFunciones],
      ['Ocupación Promedio:', `${promedioOcupacion}%`],
      ['Nivel de Ocupación:', this.obtenerNivelOcupacion(promedioOcupacion)],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['📋 DETALLE POR FUNCIÓN'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      // Headers de la tabla
      ['🎬 Película', '🏛️ Sala', '📅 Fecha', '💺 Total Asientos', '✅ Ocupados', '📊 % Ocupación', '⚡ Estado']
    ];
    
    this.reporteOcupacion.ocupacionPorFuncion.forEach((funcion: any) => {
      const estado = funcion.porcentajeOcupacion >= 70 ? 'ALTA' : 
                     funcion.porcentajeOcupacion >= 30 ? 'MEDIA' : 'BAJA';
      
      datos.push([
        funcion.pelicula,
        funcion.sala,
        this.formatearFecha(funcion.inicio),
        funcion.totalAsientos,
        funcion.asientosOcupados,
        `${funcion.porcentajeOcupacion}%`,
        estado
      ]);
    });
    
    // Estadísticas adicionales
    datos.push(['']);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    datos.push(['📈 ANÁLISIS DE OCUPACIÓN']);
    datos.push(['']);
    
    const funcionesAlta = this.reporteOcupacion.ocupacionPorFuncion.filter(f => f.porcentajeOcupacion >= 70).length;
    const funcionesMedia = this.reporteOcupacion.ocupacionPorFuncion.filter(f => f.porcentajeOcupacion >= 30 && f.porcentajeOcupacion < 70).length;
    const funcionesBaja = this.reporteOcupacion.ocupacionPorFuncion.filter(f => f.porcentajeOcupacion < 30).length;
    
    datos.push(['Funciones con Ocupación Alta (≥70%):', funcionesAlta]);
    datos.push(['Funciones con Ocupación Media (30-69%):', funcionesMedia]);
    datos.push(['Funciones con Ocupación Baja (<30%):', funcionesBaja]);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    
    return datos;
  }

  private obtenerNivelOcupacion(porcentaje: number): string {
    if (porcentaje >= 70) return '🟢 EXCELENTE';
    if (porcentaje >= 50) return '🟡 BUENA';
    if (porcentaje >= 30) return '🟠 REGULAR';
    return '🔴 BAJA';
  }

  private generarDatosTopPeliculas(): any[] {
    if (!this.reporteTopPeliculas) return [];
    
    const totalBoletos = this.reporteTopPeliculas.topPeliculas.reduce((sum, p) => sum + p.totalBoletos, 0);
    
    const datos = [
      // Header principal
      ['═══════════════════════════════════════════════════════════════'],
      ['                  🏆 TOP PELÍCULAS MÁS POPULARES                '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 INFORMACIÓN DEL PERÍODO'],
      [''],
      ['Fecha Inicio:', this.formatearFecha(this.reporteTopPeliculas.periodo.desde)],
      ['Fecha Fin:', this.formatearFecha(this.reporteTopPeliculas.periodo.hasta)],
      ['Fecha de Generación:', new Date().toLocaleString('es-MX')],
      [''],
      ['📊 RESUMEN GENERAL'],
      [''],
      ['Películas con Ventas:', this.reporteTopPeliculas.topPeliculas.length],
      ['Total de Boletos Vendidos:', totalBoletos],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['🎬 RANKING DE PELÍCULAS'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['🏅 Posición', '🎬 Película', '🎫 Boletos', '📽️ Funciones', '📊 Promedio/Función', '📈 % del Total']
    ];
    
    this.reporteTopPeliculas.topPeliculas.forEach((pelicula: any, index: number) => {
      const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
      const porcentajeTotal = totalBoletos > 0 ? ((pelicula.totalBoletos / totalBoletos) * 100).toFixed(1) : '0.0';
      
      datos.push([
        medalla,
        pelicula.titulo,
        pelicula.totalBoletos,
        pelicula.totalFunciones,
        parseFloat(pelicula.promedioBoletosPorFuncion.toFixed(1)),
        `${porcentajeTotal}%`
      ]);
    });
    
    // Análisis adicional
    datos.push(['']);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    datos.push(['📈 ANÁLISIS DE RENDIMIENTO']);
    datos.push(['']);
    
    if (this.reporteTopPeliculas.topPeliculas.length > 0) {
      const top1 = this.reporteTopPeliculas.topPeliculas[0];
      datos.push(['Película Más Exitosa:', top1.titulo]);
      datos.push(['Boletos Vendidos:', top1.totalBoletos]);
      datos.push(['Funciones Realizadas:', top1.totalFunciones]);
      datos.push(['Promedio por Función:', parseFloat(top1.promedioBoletosPorFuncion.toFixed(1))]);
    }
    datos.push(['═══════════════════════════════════════════════════════════════']);
    
    return datos;
  }

  private generarDatosVentasPorVendedor(): any[] {
    if (!this.reporteVentasPorVendedor) return [];
    
    const totalVendido = this.calcularTotalVentasVendedores();
    const totalPedidos = this.reporteVentasPorVendedor.ventasPorVendedor.reduce((sum, v) => sum + v.cantidadPedidos, 0);
    
    const datos = [
      // Header principal
      ['═══════════════════════════════════════════════════════════════'],
      ['               👥 REPORTE DE VENTAS POR VENDEDOR                '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 INFORMACIÓN DEL PERÍODO'],
      [''],
      ['Fecha Inicio:', this.formatearFecha(this.reporteVentasPorVendedor.periodo.desde)],
      ['Fecha Fin:', this.formatearFecha(this.reporteVentasPorVendedor.periodo.hasta)],
      ['Fecha de Generación:', new Date().toLocaleString('es-MX')],
      [''],
      ['📊 RESUMEN GENERAL'],
      [''],
      ['Vendedores Activos:', this.reporteVentasPorVendedor.ventasPorVendedor.length],
      ['Total Vendido:', this.formatearMoneda(totalVendido)],
      ['Total de Pedidos:', totalPedidos],
      ['Promedio por Vendedor:', this.formatearMoneda(totalVendido / this.reporteVentasPorVendedor.ventasPorVendedor.length)],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['🏆 RANKING DE VENDEDORES'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['🏅 Pos.', '👤 Vendedor', '📧 Email', '💰 Total Ventas', '📦 Pedidos', '📊 Promedio/Pedido', '📈 % del Total']
    ];
    
    this.reporteVentasPorVendedor.ventasPorVendedor.forEach((vendedor: any, index: number) => {
      const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
      const promedio = vendedor.cantidadPedidos > 0 ? vendedor.totalVentas / vendedor.cantidadPedidos : 0;
      const porcentaje = totalVendido > 0 ? ((vendedor.totalVentas / totalVendido) * 100).toFixed(1) : '0.0';
      
      datos.push([
        medalla,
        vendedor.nombre,
        vendedor.email,
        this.formatearMoneda(vendedor.totalVentas),
        vendedor.cantidadPedidos,
        this.formatearMoneda(promedio),
        `${porcentaje}%`
      ]);
    });
    
    // Análisis de rendimiento
    datos.push(['']);
    datos.push(['═══════════════════════════════════════════════════════════════']);
    datos.push(['📈 ANÁLISIS DE RENDIMIENTO']);
    datos.push(['']);
    
    if (this.reporteVentasPorVendedor.ventasPorVendedor.length > 0) {
      const mejorVendedor = this.reporteVentasPorVendedor.ventasPorVendedor[0];
      datos.push(['Mejor Vendedor:', mejorVendedor.nombre]);
      datos.push(['Total de Ventas:', this.formatearMoneda(mejorVendedor.totalVentas)]);
      datos.push(['Cantidad de Pedidos:', mejorVendedor.cantidadPedidos]);
      datos.push(['Ticket Promedio:', this.formatearMoneda(mejorVendedor.totalVentas / mejorVendedor.cantidadPedidos)]);
    }
    datos.push(['═══════════════════════════════════════════════════════════════']);
    
    return datos;
  }

  private descargarExcel(data: any[], filename: string, sheetName: string): void {
    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new();
    
    // Crear worksheet con los datos
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Aplicar estilos básicos
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Ajustar ancho de columnas
    const colWidths: any[] = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 10;
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          if (cellLength > maxWidth) {
            maxWidth = cellLength;
          }
        }
      }
      colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    worksheet['!cols'] = colWidths;
    
    // Añadir worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generar el archivo y descargarlo
    XLSX.writeFile(workbook, filename);
  }

  calcularPromedioOcupacion(): number {
    if (!this.reporteOcupacion || this.reporteOcupacion.ocupacionPorFuncion.length === 0) {
      return 0;
    }
    
    const sumaOcupacion = this.reporteOcupacion.ocupacionPorFuncion.reduce(
      (suma: number, funcion: any) => suma + funcion.porcentajeOcupacion, 0
    );
    
    return Math.round((sumaOcupacion / this.reporteOcupacion.ocupacionPorFuncion.length) * 100) / 100;
  }

  calcularTotalVentasVendedores(): number {
    if (!this.reporteVentasPorVendedor) {
      return 0;
    }
    
    return this.reporteVentasPorVendedor.ventasPorVendedor.reduce(
      (total: number, vendedor: any) => total + vendedor.totalVentas, 0
    );
  }

  private generarDatosVentasDulceria(): any[] {
    if (!this.reporteVentasDulceria) return [];
    
    const promedioPorProducto = this.reporteVentasDulceria.totalProductosVendidos > 0 
      ? this.reporteVentasDulceria.totalVentas / this.reporteVentasDulceria.totalProductosVendidos 
      : 0;
    
    const datos = [
      // Header principal
      ['═══════════════════════════════════════════════════════════════'],
      ['              🍿 REPORTE DE VENTAS DE DULCERÍA                  '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 INFORMACIÓN DEL PERÍODO'],
      [''],
      ['Fecha Inicio:', this.formatearFecha(this.reporteVentasDulceria.periodo.desde)],
      ['Fecha Fin:', this.formatearFecha(this.reporteVentasDulceria.periodo.hasta)],
      ['Fecha de Generación:', new Date().toLocaleString('es-MX')],
      [''],
      ['💰 RESUMEN FINANCIERO'],
      [''],
      ['Total de Ventas:', this.formatearMoneda(this.reporteVentasDulceria.totalVentas)],
      ['Productos Vendidos:', this.reporteVentasDulceria.totalProductosVendidos],
      ['Promedio por Producto:', this.formatearMoneda(promedioPorProducto)],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['📦 VENTAS POR PRODUCTO'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['🍬 Producto', '🏷️ Tipo', '📊 Cantidad', '💵 Total Ventas', '💰 Precio Promedio', '📈 % del Total']
    ];
    
    this.reporteVentasDulceria.ventasPorProducto.forEach((producto: any) => {
      const precioPromedio = producto.cantidadVendida > 0 ? producto.totalVentas / producto.cantidadVendida : 0;
      const totalVentas = this.reporteVentasDulceria?.totalVentas || 0;
      const porcentaje = totalVentas > 0 
        ? ((producto.totalVentas / totalVentas) * 100).toFixed(1) 
        : '0.0';
      
      datos.push([
        producto.nombre,
        producto.tipo,
        producto.cantidadVendida,
        this.formatearMoneda(producto.totalVentas),
        this.formatearMoneda(precioPromedio),
        `${porcentaje}%`
      ]);
    });
    
    // Producto más vendido
    if (this.reporteVentasDulceria.ventasPorProducto.length > 0) {
      datos.push(['']);
      datos.push(['═══════════════════════════════════════════════════════════════']);
      datos.push(['🏆 PRODUCTO MÁS VENDIDO']);
      datos.push(['']);
      
      const masVendido = this.reporteVentasDulceria.ventasPorProducto.reduce((prev, current) => 
        prev.cantidadVendida > current.cantidadVendida ? prev : current
      );
      
      datos.push(['Producto:', masVendido.nombre]);
      datos.push(['Tipo:', masVendido.tipo]);
      datos.push(['Cantidad Vendida:', masVendido.cantidadVendida]);
      datos.push(['Total Generado:', this.formatearMoneda(masVendido.totalVentas)]);
    }
    
    // Ventas por día
    if (this.reporteVentasDulceria.ventasPorDia.length > 0) {
      datos.push(['']);
      datos.push(['═══════════════════════════════════════════════════════════════']);
      datos.push(['📅 VENTAS POR DÍA']);
      datos.push(['═══════════════════════════════════════════════════════════════']);
      datos.push(['']);
      datos.push(['📅 Fecha', '📦 Cantidad Productos', '💵 Total Ventas', '📊 Promedio por Día']);
      
      this.reporteVentasDulceria.ventasPorDia.forEach((dia: any) => {
        const promedioDia = dia.cantidadProductos > 0 ? dia.totalVentas / dia.cantidadProductos : 0;
        
        datos.push([
          this.formatearFecha(dia.fecha),
          dia.cantidadProductos,
          this.formatearMoneda(dia.totalVentas),
          this.formatearMoneda(promedioDia)
        ]);
      });
      
      // Mejor día de ventas
      datos.push(['']);
      datos.push(['═══════════════════════════════════════════════════════════════']);
      datos.push(['🌟 MEJOR DÍA DE VENTAS']);
      datos.push(['']);
      
      const mejorDia = this.reporteVentasDulceria.ventasPorDia.reduce((prev, current) => 
        prev.totalVentas > current.totalVentas ? prev : current
      );
      
      datos.push(['Fecha:', this.formatearFecha(mejorDia.fecha)]);
      datos.push(['Productos Vendidos:', mejorDia.cantidadProductos]);
      datos.push(['Total del Día:', this.formatearMoneda(mejorDia.totalVentas)]);
    }
    
    datos.push(['═══════════════════════════════════════════════════════════════']);
    
    return datos;
  }

  // Funciones auxiliares para mostrar información del cliente
  contarBoletos(venta: any): number {
    if (!venta.items) return 0;
    return venta.items.filter((item: any) => item.tipo === 'BOLETO').reduce((sum: number, item: any) => sum + item.cantidad, 0);
  }

  contarDulceria(venta: any): number {
    if (!venta.items) return 0;
    return venta.items.filter((item: any) => item.tipo === 'DULCERIA').reduce((sum: number, item: any) => sum + item.cantidad, 0);
  }

  // Funciones auxiliares para Serie Temporal
  calcularTotalSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + dia.ingresos, 0);
  }

  calcularTotalPedidosSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + dia.pedidos, 0);
  }

  calcularPromedioDiario(): number {
    if (!this.reporteSerieTemporal || this.reporteSerieTemporal.serie.length === 0) return 0;
    return this.calcularTotalSerie() / this.reporteSerieTemporal.serie.length;
  }

  calcularPorcentajeDelTotal(ingresos: number): number {
    const total = this.calcularTotalSerie();
    if (total === 0) return 0;
    return Math.round((ingresos / total) * 100 * 10) / 10; // Un decimal
  }

  calcularTotalBoletosSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + (dia.ingresosBoletos || 0), 0);
  }

  calcularTotalDulceriaSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + (dia.ingresosDulceria || 0), 0);
  }

  calcularCantidadBoletosSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + (dia.cantidadBoletos || 0), 0);
  }

  calcularCantidadDulceriaSerie(): number {
    if (!this.reporteSerieTemporal) return 0;
    return this.reporteSerieTemporal.serie.reduce((sum, dia) => sum + (dia.cantidadDulceria || 0), 0);
  }

  // Método para obtener la venta máxima de dulcería en un día (para la barra de progreso)
  getMaxVentaDulceriaDia(): number {
    if (!this.reporteVentasDulceria || !this.reporteVentasDulceria.ventasPorDia || this.reporteVentasDulceria.ventasPorDia.length === 0) {
      return 1; // Evitar división por cero
    }
    return Math.max(...this.reporteVentasDulceria.ventasPorDia.map(dia => dia.totalVentas));
  }

  private generarDatosDashboardKPIs(): any[] {
    if (!this.reporteDashboardKPIs) return [];
    
    return [
      ['═══════════════════════════════════════════════════════════════'],
      ['                  📊 DASHBOARD DE KPIs                          '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Período:', `${this.formatearFecha(this.reporteDashboardKPIs.periodo.desde)} - ${this.formatearFecha(this.reporteDashboardKPIs.periodo.hasta)}`],
      [''],
      ['💰 INGRESOS TOTALES:', this.formatearMoneda(this.reporteDashboardKPIs.kpis.totalIngresos)],
      ['🎫 BOLETOS VENDIDOS:', this.reporteDashboardKPIs.kpis.totalBoletos],
      ['🍿 VENTAS DULCERÍA:', this.formatearMoneda(this.reporteDashboardKPIs.kpis.ventasDulceria)],
      ['📦 PEDIDOS TOTALES:', this.reporteDashboardKPIs.kpis.totalPedidos],
      ['👥 CLIENTES ÚNICOS:', this.reporteDashboardKPIs.kpis.clientesUnicos],
      ['💵 TICKET PROMEDIO:', this.formatearMoneda(this.reporteDashboardKPIs.kpis.ticketPromedio)],
      ['📊 OCUPACIÓN PROMEDIO:', `${this.reporteDashboardKPIs.kpis.ocupacionPromedio.toFixed(1)}%`],
      [''],
      ['═══════════════════════════════════════════════════════════════']
    ];
  }

  private generarDatosSerieTemporal(): any[] {
    if (!this.reporteSerieTemporal) return [];
    
    const datos = [
      ['═══════════════════════════════════════════════════════════════'],
      ['                📈 SERIE TEMPORAL DE VENTAS                     '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Fecha', '💰 Ingresos', '📦 Pedidos', '🎫 Boletos', '🍿 Dulcería', '💵 Ing. Boletos', '💵 Ing. Dulcería']
    ];
    
    this.reporteSerieTemporal.serie.forEach((dia: any) => {
      datos.push([
        this.formatearFecha(dia.fecha),
        this.formatearMoneda(dia.ingresos),
        dia.pedidos,
        dia.cantidadBoletos || 0,
        dia.cantidadDulceria || 0,
        this.formatearMoneda(dia.ingresosBoletos || 0),
        this.formatearMoneda(dia.ingresosDulceria || 0)
      ]);
    });
    
    datos.push(['']);
    datos.push(['TOTALES:', this.formatearMoneda(this.calcularTotalSerie()), String(this.calcularTotalPedidosSerie()), 
                String(this.calcularCantidadBoletosSerie()), String(this.calcularCantidadDulceriaSerie()),
                this.formatearMoneda(this.calcularTotalBoletosSerie()), this.formatearMoneda(this.calcularTotalDulceriaSerie())]);
    
    return datos;
  }

  private generarDatosVentasPorCanal(): any[] {
    if (!this.reporteVentasPorCanal) return [];
    
    const datos = [
      ['═══════════════════════════════════════════════════════════════'],
      ['              📱 REPORTE DE VENTAS POR CANAL                    '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Período:', `${this.formatearFecha(this.reporteVentasPorCanal.periodo.desde)} - ${this.formatearFecha(this.reporteVentasPorCanal.periodo.hasta)}`],
      [''],
      ['📊 Canal', '💰 Total Ventas', '📦 Cantidad', '📈 % del Total']
    ];
    
    const total = this.reporteVentasPorCanal.totalVentas;
    
    // Online
    const porcentajeOnline = total > 0 ? ((this.reporteVentasPorCanal.ventasPorCanal.online.total / total) * 100).toFixed(1) : '0.0';
    datos.push([
      '🌐 Online',
      this.formatearMoneda(this.reporteVentasPorCanal.ventasPorCanal.online.total),
      String(this.reporteVentasPorCanal.ventasPorCanal.online.cantidad),
      `${porcentajeOnline}%`
    ]);
    
    // Taquilla
    const porcentajeTaquilla = total > 0 ? ((this.reporteVentasPorCanal.ventasPorCanal.taquilla.total / total) * 100).toFixed(1) : '0.0';
    datos.push([
      '🎫 Taquilla',
      this.formatearMoneda(this.reporteVentasPorCanal.ventasPorCanal.taquilla.total),
      String(this.reporteVentasPorCanal.ventasPorCanal.taquilla.cantidad),
      `${porcentajeTaquilla}%`
    ]);
    
    datos.push(['']);
    datos.push(['TOTAL:', this.formatearMoneda(total), String(this.reporteVentasPorCanal.totalPedidos), '100%']);
    
    return datos;
  }

  private generarDatosDescuentos(): any[] {
    if (!this.reporteDescuentos) return [];
    
    return [
      ['═══════════════════════════════════════════════════════════════'],
      ['           🎁 REPORTE DE DESCUENTOS Y PROMOCIONES               '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Período:', `${this.formatearFecha(this.reporteDescuentos.periodo.desde)} - ${this.formatearFecha(this.reporteDescuentos.periodo.hasta)}`],
      [''],
      ['📊 RESUMEN DE DESCUENTOS'],
      [''],
      ['Total de Pedidos:', this.reporteDescuentos.totalPedidos],
      ['Pedidos con Descuento:', this.reporteDescuentos.pedidosConDescuento],
      ['% de Pedidos con Descuento:', `${this.reporteDescuentos.porcentajeDescuento.toFixed(1)}%`],
      ['Total Descuentos:', this.formatearMoneda(this.reporteDescuentos.totalDescuentos)],
      ['Promedio de Descuento:', this.formatearMoneda(this.reporteDescuentos.promedioDescuento)],
      [''],
      ['═══════════════════════════════════════════════════════════════']  
    ];
  }

  private generarDatosHorariosPico(): any[] {
    if (!this.reporteHorariosPico) return [];
    
    const datos = [
      ['═══════════════════════════════════════════════════════════════'],
      ['               ⏰ REPORTE DE HORARIOS PICO                      '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Período:', `${this.formatearFecha(this.reporteHorariosPico.periodo.desde)} - ${this.formatearFecha(this.reporteHorariosPico.periodo.hasta)}`],
      [''],
      ['🕐 Hora', '🎬 Funciones', '🎫 Boletos', '💺 Capacidad', '📊 % Ocupación']
    ];
    
    const totalBoletos = this.reporteHorariosPico.horariosPico.reduce((sum: number, h: any) => sum + h.totalBoletos, 0);
    
    this.reporteHorariosPico.horariosPico.forEach((horario: any) => {
      const porcentaje = totalBoletos > 0 ? ((horario.totalBoletos / totalBoletos) * 100).toFixed(1) : '0.0';
      datos.push([
        `${horario.hora}:00`,
        horario.funciones,
        horario.totalBoletos,
        horario.capacidadTotal,
        `${horario.ocupacionPromedio.toFixed(1)}%`
      ]);
    });
    
    datos.push(['']);
    if (this.reporteHorariosPico.horaMasPopular !== null) {
      datos.push(['⭐ Hora más popular:', `${this.reporteHorariosPico.horaMasPopular}:00`]);
    }
    
    return datos;
  }

  private generarDatosIngresosPorPelicula(): any[] {
    if (!this.reporteIngresosPorPelicula) return [];
    
    const datos = [
      ['═══════════════════════════════════════════════════════════════'],
      ['            🎬 REPORTE DE INGRESOS POR PELÍCULA                 '],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📅 Período:', `${this.formatearFecha(this.reporteIngresosPorPelicula.periodo.desde)} - ${this.formatearFecha(this.reporteIngresosPorPelicula.periodo.hasta)}`],
      [''],
      ['🎬 Película', '🎫 Boletos', '🎬 Funciones', '💰 Ingreso Total', '💵 Promedio/Función', '📈 % del Total']
    ];
    
    const totalIngresos = this.reporteIngresosPorPelicula.totalIngresos;
    
    this.reporteIngresosPorPelicula.peliculas.forEach((pelicula: any) => {
      const porcentaje = totalIngresos > 0 ? ((pelicula.ingresoTotal / totalIngresos) * 100).toFixed(1) : '0.0';
      datos.push([
        pelicula.titulo,
        pelicula.totalBoletos,
        pelicula.totalFunciones,
        this.formatearMoneda(pelicula.ingresoTotal),
        this.formatearMoneda(pelicula.ingresoPromedioPorFuncion),
        `${porcentaje}%`
      ]);
    });
    
    datos.push(['']);
    datos.push(['TOTALES:', '', '', this.formatearMoneda(totalIngresos), '', '100%']);
    
    return datos;
  }
}