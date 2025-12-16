import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface VentaVendedor {
  vendedorId: string;
  nombre: string;
  email: string;
  totalVentas: number;
  cantidadPedidos: number;
}

interface ReporteVentas {
  periodo: {
    desde: Date;
    hasta: Date;
  };
  ventasPorVendedor: VentaVendedor[];
}

interface DesglosePorTipo {
  boletos: {
    cantidad: number;
    total: number;
  };
  dulceria: {
    cantidad: number;
    total: number;
  };
}

@Component({
  selector: 'app-mis-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mis-ventas.component.html',
  styleUrls: ['./mis-ventas.component.scss']
})
export class MisVentasComponent implements OnInit {
  cargandoVentas = false;
  misVentas: VentaVendedor | null = null;
  desglose: DesglosePorTipo | null = null;
  filtroTipo: 'TODOS' | 'BOLETO' | 'DULCERIA' = 'TODOS';
  periodo = {
    desde: '',
    hasta: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Establecer período por defecto (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.periodo.desde = hace30Dias.toISOString().split('T')[0];
    this.periodo.hasta = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarMisVentas();
    this.cargarDesglose();
  }

  cargarMisVentas(): void {
    this.cargandoVentas = true;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('Usuario no autenticado');
      this.cargandoVentas = false;
      return;
    }

    // Obtener token de autenticación
    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      this.cargandoVentas = false;
      return;
    }

    // Construir URL con parámetros
    let url = `${environment.apiUrl}/reportes/mis-ventas/${currentUser.id}`;
    const params: string[] = [];
    
    if (this.periodo.desde) {
      // Agregar T00:00:00 para asegurar que se envía al inicio del día en formato ISO
      const fechaDesde = this.periodo.desde + 'T00:00:00';
      params.push(`desde=${fechaDesde}`);
      console.log('📅 FRONTEND: Fecha desde enviada:', fechaDesde);
    }
    if (this.periodo.hasta) {
      // Agregar T23:59:59 para asegurar que se envía al final del día en formato ISO
      const fechaHasta = this.periodo.hasta + 'T23:59:59';
      params.push(`hasta=${fechaHasta}`);
      console.log('📅 FRONTEND: Fecha hasta enviada:', fechaHasta);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    console.log('🔗 FRONTEND: URL de consulta:', url);

    // Crear headers con el token de autenticación
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get<ReporteVentas>(url, { headers }).subscribe({
      next: (reporte) => {
        console.log('📊 Reporte de mis ventas:', reporte);
        
        // Buscar los datos del vendedor actual
        this.misVentas = reporte.ventasPorVendedor.find(
          v => v.vendedorId === currentUser.id
        ) || {
          vendedorId: currentUser.id,
          nombre: currentUser.nombre || 'N/A',
          email: currentUser.email || 'N/A',
          totalVentas: 0,
          cantidadPedidos: 0
        };
        
        this.cargandoVentas = false;
      },
      error: (error) => {
        console.error('Error al cargar mis ventas:', error);
        this.cargandoVentas = false;
        this.misVentas = null;
      }
    });
  }

  cargarDesglose(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('Usuario no autenticado');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    // Construir URL con parámetros
    let url = `${environment.apiUrl}/reportes/mis-ventas/${currentUser.id}/desglose`;
    const params: string[] = [];
    
    if (this.periodo.desde) {
      // Agregar T00:00:00 para asegurar que se envía al inicio del día en formato ISO
      const fechaDesde = this.periodo.desde + 'T00:00:00';
      params.push(`desde=${fechaDesde}`);
      console.log('📅 FRONTEND desglose: Fecha desde enviada:', fechaDesde);
    }
    if (this.periodo.hasta) {
      // Agregar T23:59:59 para asegurar que se envía al final del día en formato ISO
      const fechaHasta = this.periodo.hasta + 'T23:59:59';
      params.push(`hasta=${fechaHasta}`);
      console.log('📅 FRONTEND desglose: Fecha hasta enviada:', fechaHasta);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    console.log('🔗 FRONTEND desglose: URL de consulta:', url);

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get<any>(url, { headers }).subscribe({
      next: (resultado) => {
        console.log('📊 FRONTEND: Desglose recibido:', resultado);
        console.log('📊 FRONTEND: Desglose.desglose:', resultado.desglose);
        this.desglose = resultado.desglose;
        console.log('📊 FRONTEND: this.desglose asignado:', this.desglose);
        if (this.desglose) {
          console.log('✅ FRONTEND: Boletos:', this.desglose.boletos);
          console.log('✅ FRONTEND: Dulcería:', this.desglose.dulceria);
        }
      },
      error: (error) => {
        console.error('❌ FRONTEND: Error al cargar desglose:', error);
        this.desglose = null;
      }
    });
  }

  limpiarFiltros(): void {
    // Restablecer a los valores por defecto (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.periodo.desde = hace30Dias.toISOString().split('T')[0];
    this.periodo.hasta = new Date().toISOString().split('T')[0];
    this.filtroTipo = 'TODOS';
    
    // Recargar con filtros limpios
    this.cargarMisVentas();
    this.cargarDesglose();
  }

  volver(): void {
    this.router.navigate(['/vendedor']);
  }
}
