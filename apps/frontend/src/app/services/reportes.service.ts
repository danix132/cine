import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReporteVentas {
  periodo: { desde: Date; hasta: Date };
  totalVentas: number;
  cantidadPedidos: number;
  ventas: {
    id: string;
    total: number;
    createdAt: Date;
    usuario: { nombre: string; email: string };
    pedidoItems?: {
      boleto?: any;
      dulceriaItem?: any;
    }[];
  }[];
}

export interface ReporteOcupacion {
  periodo: { desde: Date; hasta: Date };
  totalFunciones: number;
  ocupacionPorFuncion: {
    funcionId: string;
    pelicula: string;
    sala: string;
    inicio: Date;
    totalAsientos: number;
    asientosOcupados: number;
    porcentajeOcupacion: number;
  }[];
}

export interface ReporteTopPeliculas {
  periodo: { desde: Date; hasta: Date };
  topPeliculas: {
    id: string;
    titulo: string;
    totalBoletos: number;
    totalFunciones: number;
    promedioBoletosPorFuncion: number;
  }[];
}

export interface ReporteVentasPorVendedor {
  periodo: { desde: Date; hasta: Date };
  ventasPorVendedor: {
    vendedorId: string;
    nombre: string;
    email: string;
    totalVentas: number;
    cantidadPedidos: number;
  }[];
}

export interface ReporteVentasDulceria {
  periodo: { desde: Date; hasta: Date };
  totalVentas: number;
  totalProductosVendidos: number;
  ventasPorProducto: {
    productoId: string;
    nombre: string;
    tipo: string;
    cantidadVendida: number;
    totalVentas: number;
  }[];
  ventasPorDia: {
    fecha: string;
    cantidadProductos: number;
    totalVentas: number;
  }[];
}

export interface ReporteVentasPorCanal {
  periodo: { desde: Date; hasta: Date };
  ventasPorCanal: {
    online: { cantidad: number; total: number };
    taquilla: { cantidad: number; total: number };
  };
  ventasPorMetodoPago: {
    metodo: string;
    cantidad: number;
    total: number;
  }[];
  totalPedidos: number;
  totalVentas: number;
}

export interface ReporteDescuentos {
  periodo: { desde: Date; hasta: Date };
  totalPedidos: number;
  pedidosConDescuento: number;
  porcentajeDescuento: number;
  totalDescuentos: number;
  promedioDescuento: number;
}

export interface ReporteHorariosPico {
  periodo: { desde: Date; hasta: Date };
  horariosPico: {
    hora: number;
    funciones: number;
    totalBoletos: number;
    capacidadTotal: number;
    ocupacionPromedio: number;
  }[];
  horaMasPopular: number | null;
}

export interface ReporteIngresosPorPelicula {
  periodo: { desde: Date; hasta: Date };
  peliculas: {
    peliculaId: string;
    titulo: string;
    generos: string[];
    totalFunciones: number;
    totalBoletos: number;
    ingresoTotal: number;
    ingresoPromedioPorFuncion: number;
    precioPromedioBoleto: number;
    funciones: {
      funcionId: string;
      sala: string;
      inicio: Date;
      boletos: number;
      ingreso: number;
    }[];
  }[];
  totalIngresos: number;
}

export interface ReporteDashboardKPIs {
  periodo: { desde: Date; hasta: Date };
  kpis: {
    totalIngresos: number;
    totalPedidos: number;
    totalBoletos: number;
    ticketPromedio: number;
    precioPromedioBoleto: number;
    ocupacionPromedio: number;
    ventasDulceria: number;
    clientesUnicos: number;
    funcionesTotales: number;
  };
}

export interface ReporteSerieTemporal {
  periodo: { desde: Date; hasta: Date };
  serie: {
    fecha: string;
    ingresos: number;
    pedidos: number;
    ingresosBoletos: number;
    ingresosDulceria: number;
    cantidadBoletos: number;
    cantidadDulceria: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  getReporteVentas(desde: string, hasta: string): Observable<ReporteVentas> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteVentas>(`${this.apiUrl}/ventas`, { params });
  }

  getReporteOcupacion(desde: string, hasta: string): Observable<ReporteOcupacion> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteOcupacion>(`${this.apiUrl}/ocupacion`, { params });
  }

  getReporteTopPeliculas(desde: string, hasta: string, limit: number = 10): Observable<ReporteTopPeliculas> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta)
      .set('limit', limit.toString());
    
    return this.http.get<ReporteTopPeliculas>(`${this.apiUrl}/top-peliculas`, { params });
  }

  getReporteVentasPorVendedor(desde: string, hasta: string): Observable<ReporteVentasPorVendedor> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteVentasPorVendedor>(`${this.apiUrl}/ventas-por-vendedor`, { params });
  }

  getReporteVentasDulceria(desde: string, hasta: string): Observable<ReporteVentasDulceria> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteVentasDulceria>(`${this.apiUrl}/ventas-dulceria`, { params });
  }

  getReporteVentasPorCanal(desde: string, hasta: string): Observable<ReporteVentasPorCanal> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteVentasPorCanal>(`${this.apiUrl}/ventas-por-canal`, { params });
  }

  getReporteDescuentos(desde: string, hasta: string): Observable<ReporteDescuentos> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteDescuentos>(`${this.apiUrl}/descuentos-promociones`, { params });
  }

  getReporteHorariosPico(desde: string, hasta: string): Observable<ReporteHorariosPico> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteHorariosPico>(`${this.apiUrl}/horarios-pico`, { params });
  }

  getReporteIngresosPorPelicula(desde: string, hasta: string): Observable<ReporteIngresosPorPelicula> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteIngresosPorPelicula>(`${this.apiUrl}/ingresos-por-pelicula`, { params });
  }

  getReporteDashboardKPIs(desde: string, hasta: string): Observable<ReporteDashboardKPIs> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteDashboardKPIs>(`${this.apiUrl}/dashboard-kpis`, { params });
  }

  getReporteSerieTemporal(desde: string, hasta: string): Observable<ReporteSerieTemporal> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    
    return this.http.get<ReporteSerieTemporal>(`${this.apiUrl}/serie-temporal`, { params });
  }
}