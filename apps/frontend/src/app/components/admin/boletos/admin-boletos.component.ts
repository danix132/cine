import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoletosService } from '../../../services/boletos.service';
import { Boleto } from '../../../models/boleto.model';

@Component({
  selector: 'app-admin-boletos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boletos.component.html',
  styleUrls: ['./admin-boletos.component.scss']
})
export class AdminBoletosComponent implements OnInit {
  boletos: Boleto[] = [];
  boletosFiltrados: Boleto[] = [];
  loading = false;
  
  // Filtros
  filtroBusqueda = '';
  filtroFecha = '';
  
  // Paginación
  paginaActual = 1;
  itemsPorPagina = 20;
  totalPaginas = 1;

  constructor(private boletosService: BoletosService) {}

  ngOnInit(): void {
    this.cargarBoletos();
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
}
