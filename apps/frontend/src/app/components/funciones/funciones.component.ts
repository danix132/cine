import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion.model';

@Component({
  selector: 'app-funciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent implements OnInit {
  funciones: Funcion[] = [];
  funcionesFiltradas: Funcion[] = [];
  isLoading = true;
  errorMessage = '';
  peliculaId: string | null = null;

  // Filtro por fecha
  fechaSeleccionada: string = '';
  fechasDisponibles: { fecha: Date; fechaStr: string; diaNombre: string; dia: number; mes: string; activo: boolean }[] = [];

  constructor(
    private funcionesService: FuncionesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro de la película si existe
    this.route.paramMap.subscribe(params => {
      this.peliculaId = params.get('peliculaId');
      this.loadFunciones();
    });
  }

  loadFunciones(): void {
    this.isLoading = true;
    this.funcionesService.getFuncionesDisponibles().subscribe({
      next: (funciones) => {
        // Si hay peliculaId, filtrar solo las funciones de esa película
        if (this.peliculaId) {
          this.funciones = funciones.filter(f => f.pelicula?.id === this.peliculaId);
        } else {
          this.funciones = funciones;
        }
        this.generarCalendarioFechas();
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las funciones';
        this.isLoading = false;
        console.error('Error loading funciones:', error);
      }
    });
  }

  generarCalendarioFechas(): void {
    const fechasSet = new Set<string>();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Recolectar todas las fechas únicas de las funciones
    this.funciones.forEach((funcion) => {
      const fechaFuncion = new Date(funcion.inicio);
      fechaFuncion.setHours(0, 0, 0, 0);
      
      // Solo incluir fechas futuras o de hoy
      if (fechaFuncion >= hoy) {
        const fechaStr = fechaFuncion.toISOString().split('T')[0];
        fechasSet.add(fechaStr);
      }
    });

    // Convertir a array y ordenar
    const fechasArray = Array.from(fechasSet).sort();

    // Crear objetos de fecha con información adicional
    this.fechasDisponibles = fechasArray.map(fechaStr => {
      const fecha = new Date(fechaStr + 'T00:00:00');
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      return {
        fecha: fecha,
        fechaStr: fechaStr,
        diaNombre: diasSemana[fecha.getDay()],
        dia: fecha.getDate(),
        mes: meses[fecha.getMonth()],
        activo: false
      };
    });

    // Limitar a los próximos 14 días si hay muchas fechas
    if (this.fechasDisponibles.length > 14) {
      this.fechasDisponibles = this.fechasDisponibles.slice(0, 14);
    }
  }

  aplicarFiltros(): void {
    console.log('🔍 Aplicando filtros...');
    console.log('Fecha seleccionada:', this.fechaSeleccionada);
    console.log('Total funciones:', this.funciones.length);

    if (!this.fechaSeleccionada) {
      this.funcionesFiltradas = [...this.funciones];
      this.fechasDisponibles.forEach(f => f.activo = false);
      console.log('Sin filtro - Mostrando todas las funciones:', this.funcionesFiltradas.length);
    } else {
      // Filtrar funciones por fecha
      this.funcionesFiltradas = this.funciones.filter((funcion) => {
        const fechaFuncion = new Date(funcion.inicio);
        
        // Obtener fecha en formato local (sin considerar hora)
        const year = fechaFuncion.getFullYear();
        const month = String(fechaFuncion.getMonth() + 1).padStart(2, '0');
        const day = String(fechaFuncion.getDate()).padStart(2, '0');
        const fechaFuncionStr = `${year}-${month}-${day}`;
        
        const coincide = fechaFuncionStr === this.fechaSeleccionada;
        
        console.log('Comparando función:', {
          pelicula: funcion.pelicula?.titulo,
          inicioOriginal: funcion.inicio,
          fechaFuncionParsed: fechaFuncion.toLocaleString(),
          fechaFuncionStr: fechaFuncionStr,
          fechaSeleccionada: this.fechaSeleccionada,
          coincide: coincide
        });
        
        return coincide;
      });

      // Marcar la fecha seleccionada como activa
      this.fechasDisponibles.forEach(f => {
        f.activo = f.fechaStr === this.fechaSeleccionada;
      });

      console.log('✅ Funciones filtradas:', this.funcionesFiltradas.length);
      console.log('Funciones que coinciden:', this.funcionesFiltradas.map(f => ({
        pelicula: f.pelicula?.titulo,
        inicio: f.inicio,
        sala: f.sala?.nombre
      })));
    }
  }

  onFechaChange(fechaStr: string): void {
    console.log('📅 Fecha clickeada:', fechaStr);
    
    // Si se hace clic en la misma fecha, deseleccionar
    if (this.fechaSeleccionada === fechaStr) {
      console.log('Deseleccionando fecha');
      this.fechaSeleccionada = '';
    } else {
      console.log('Seleccionando nueva fecha');
      this.fechaSeleccionada = fechaStr;
    }
    
    this.aplicarFiltros();
  }

  limpiarFiltro(): void {
    this.fechaSeleccionada = '';
    this.aplicarFiltros();
  }

  seleccionarAsientos(funcion: Funcion): void {
    this.router.navigate(['/seleccion-asientos', funcion.id]);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/default-poster.svg';
    }
  }
}
