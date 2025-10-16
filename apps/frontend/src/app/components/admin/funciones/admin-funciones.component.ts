import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FuncionesService } from '../../../services/funciones.service';
import { PeliculasService } from '../../../services/peliculas.service';
import { SalasService } from '../../../services/salas.service';
import { Funcion, CreateFuncionRequest, UpdateFuncionRequest } from '../../../models/funcion.model';
import { Pelicula } from '../../../models/pelicula.model';
import { Sala } from '../../../models/sala.model';
import { PaginatedResponse } from '../../../models/common.model';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-funciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-funciones.component.html',
  styleUrls: ['./admin-funciones.component.scss']
})
export class AdminFuncionesComponent implements OnInit {
  funcionesPaginadas: PaginatedResponse<Funcion> = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  peliculas: Pelicula[] = [];
  salas: Sala[] = [];
  funcionForm: FormGroup;
  funcionSeleccionada: Funcion | null = null;
  
  loading = false;
  guardando = false;
  modoEdicion = false;
  
  // Control de modales
  mostrarModalFuncion = false;
  mostrarModalDetalles = false;
  
  // Filtros
  filtroFecha = '';
  filtroPeliculaId = '';
  filtroSalaId = '';

  // Modo offline para desarrollo
  modoOffline = false;
  
  // Paginación
  paginaActual = 1;
  itemsPorPagina = 10;

  constructor(
    private funcionesService: FuncionesService,
    private peliculasService: PeliculasService,
    private salasService: SalasService,
    private fb: FormBuilder
  ) {
    this.funcionForm = this.fb.group({
      pelicula_id: ['', [Validators.required]],
      sala_id: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      estado: ['ACTIVA']
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    console.log('🔄 Iniciando carga de datos...');
    this.verificarConectividad();
  }

  verificarConectividad(): void {
    console.log('🔍 Verificando conectividad con el backend...');
    
    // Try a simple health check first
    this.funcionesService.getFunciones({ page: 1, limit: 1 }).subscribe({
      next: (response) => {
        console.log('✅ Backend conectado correctamente');
        this.cargarFunciones();
        this.cargarPeliculas();
        this.cargarSalas();
      },
      error: (error) => {
        console.error('❌ Error de conectividad:', error);
        this.loading = false;
        
        let errorMsg = '❌ No se puede conectar al servidor backend.\n\n';
        if (error.status === 0) {
          errorMsg += 'Posibles causas:\n';
          errorMsg += '• El servidor backend no está ejecutándose\n';
          errorMsg += '• Problemas de red o CORS\n';
          errorMsg += '• Puerto 3000 bloqueado\n\n';
          errorMsg += 'Soluciones:\n';
          errorMsg += '• Ejecuta "npm run start:dev" en el backend\n';
          errorMsg += '• Verifica que el puerto 3000 esté disponible';
        } else if (error.status === 404) {
          errorMsg += 'El endpoint /api/funciones no existe';
        } else if (error.status >= 500) {
          errorMsg += 'Error interno del servidor';
        }
        
        // Ask user if they want to continue in offline mode
        const continuar = confirm(errorMsg + '\n\n¿Deseas continuar en modo demo sin backend?');
        if (continuar) {
          this.activarModoOffline();
        }
      }
    });
  }

  activarModoOffline(): void {
    this.modoOffline = true;
    console.log('🔄 Activando modo offline/demo');
    
    // Set demo data
    this.funcionesPaginadas = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
    
    this.peliculas = [
      { id: '1', titulo: 'Película Demo 1', estado: 'ACTIVA' as any },
      { id: '2', titulo: 'Película Demo 2', estado: 'ACTIVA' as any }
    ] as any;
    
    this.salas = [
      { id: '1', nombre: 'Sala 1', filas: 10, asientosPorFila: 15, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', nombre: 'Sala 2', filas: 8, asientosPorFila: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];
    
    this.loading = false;
    alert('✅ Modo demo activado. Los filtros funcionarán pero no hay datos del servidor.');
  }

  mostrarAyudaConexion(): void {
    const mensaje = `🔧 AYUDA DE CONEXIÓN AL BACKEND

📍 Estado actual:
${this.modoOffline ? '🔴 Modo offline/demo activo' : '🟡 Intentando conectar...'}

🚀 Pasos para iniciar el servidor backend:

1️⃣ Abrir terminal en el backend:
   cd C:\\Users\\AdminORT\\cine-app\\apps\\backend

2️⃣ Instalar dependencias (si es necesario):
   npm install

3️⃣ Configurar base de datos:
   npm run db:generate
   npm run db:push

4️⃣ Iniciar servidor:
   npm run start:dev

5️⃣ Verificar que esté ejecutándose:
   ✅ Debe mostrar: "Application is running on: http://localhost:3000"
   ✅ En el navegador: http://localhost:3000/api

💡 Problemas comunes:
• Puerto 3000 ocupado → Cambiar puerto o cerrar proceso
• Falta Prisma → Ejecutar: npm run db:generate
• Error de permisos → Ejecutar terminal como admin

🔄 Una vez iniciado, recarga esta página`;

    alert(mensaje);
  }

  cargarFunciones(): void {
    this.loading = true;
    
    // First, try to load all functions without filters
    const basicParams = {
      page: this.paginaActual,
      limit: this.itemsPorPagina
    };

    console.log('Cargando funciones con parámetros básicos:', basicParams);

    this.funcionesService.getFunciones(basicParams).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        
        // Apply client-side filtering if needed
        let funcionesFiltradas = response.data || [];
        
        // Filter by date
        if (this.filtroFecha) {
          funcionesFiltradas = funcionesFiltradas.filter(funcion => {
            const fechaFuncion = new Date(funcion.inicio).toISOString().split('T')[0];
            return fechaFuncion === this.filtroFecha;
          });
        }
        
        // Filter by movie
        if (this.filtroPeliculaId && this.filtroPeliculaId !== '') {
          funcionesFiltradas = funcionesFiltradas.filter(funcion => 
            funcion.peliculaId === this.filtroPeliculaId
          );
        }
        
        // Filter by room
        if (this.filtroSalaId && this.filtroSalaId !== '') {
          funcionesFiltradas = funcionesFiltradas.filter(funcion => 
            funcion.salaId === this.filtroSalaId
          );
        }
        
        // Update the response with filtered data
        this.funcionesPaginadas = {
          ...response,
          data: funcionesFiltradas,
          total: funcionesFiltradas.length
        };
        
        this.loading = false;
        console.log('Funciones filtradas:', this.funcionesPaginadas);
      },
      error: (error) => {
        console.error('Error detallado al cargar funciones:', error);
        this.loading = false;
        
        // Show more specific error message
        let errorMessage = 'Error al cargar las funciones';
        if (error.status === 0) {
          errorMessage = 'Error de conexión: Verifica que el servidor backend esté ejecutándose en http://localhost:3000';
        } else if (error.status === 404) {
          errorMessage = 'Error 404: Endpoint no encontrado';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor interno';
        } else if (error.error?.message) {
          errorMessage = `Error: ${error.error.message}`;
        }
        
        alert(errorMessage);
      }
    });
  }

  cargarPeliculas(): void {
    this.peliculasService.getPeliculas({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.peliculas = response.data.filter((p: any) => p.estado === 'ACTIVA');
      },
      error: (error) => {
        console.error('Error al cargar películas:', error);
      }
    });
  }

  cargarSalas(): void {
    this.salasService.getSalas({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.salas = response.data;
      },
      error: (error) => {
        console.error('Error al cargar salas:', error);
      }
    });
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros:', {
      fecha: this.filtroFecha,
      peliculaId: this.filtroPeliculaId,
      salaId: this.filtroSalaId
    });
    
    // Validate filters before applying
    if (this.filtroFecha && this.filtroFecha.length === 0) {
      this.filtroFecha = '';
    }
    if (this.filtroPeliculaId && this.filtroPeliculaId.length === 0) {
      this.filtroPeliculaId = '';
    }
    if (this.filtroSalaId && this.filtroSalaId.length === 0) {
      this.filtroSalaId = '';
    }
    
    // Reset pagination to first page when applying filters
    this.paginaActual = 1;
    this.cargarFunciones();
  }

  limpiarFiltros(): void {
    this.filtroFecha = '';
    this.filtroPeliculaId = '';
    this.filtroSalaId = '';
    
    // Reset pagination and reload all functions
    this.paginaActual = 1;
    this.cargarFunciones();
    
    console.log('Filtros limpiados');
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroFecha || this.filtroPeliculaId || this.filtroSalaId);
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtroFecha) count++;
    if (this.filtroPeliculaId) count++;
    if (this.filtroSalaId) count++;
    return count;
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.funcionForm.reset();
    this.funcionForm.patchValue({ estado: 'ACTIVA' });
    this.mostrarModalFuncion = true;
  }

  editarFuncion(funcion: Funcion): void {
    this.modoEdicion = true;
    this.funcionSeleccionada = funcion;
    
    // Convertir la fecha completa a fecha y hora separadas (manteniendo zona horaria local)
    const fechaObj = new Date(funcion.inicio);
    
    // Obtener fecha en formato local para evitar problemas de zona horaria
    const año = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const fecha = `${año}-${mes}-${dia}`;
    
    // Obtener hora en formato local
    const horas = String(fechaObj.getHours()).padStart(2, '0');
    const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
    const hora = `${horas}:${minutos}`;
    
    // Debug para verificar conversión de fechas
    console.log('📅 Editando función - conversión de fecha:', {
      funcionInicio: funcion.inicio,
      fechaObj: fechaObj,
      fechaFormato: fecha,
      horaFormato: hora
    });

    this.funcionForm.patchValue({
      pelicula_id: funcion.peliculaId,
      sala_id: funcion.salaId,
      fecha: fecha,
      hora: hora,
      precio: funcion.precio,
      estado: funcion.cancelada ? 'CANCELADA' : 'ACTIVA'
    });
    
    this.mostrarModalFuncion = true;
  }

  guardarFuncion(): void {
    if (!this.funcionForm.valid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.guardando = true;
    const formData = this.funcionForm.value;

    if (this.modoEdicion && this.funcionSeleccionada) {
      // Actualizar función existente
      const updateData: UpdateFuncionRequest = {
        peliculaId: formData.pelicula_id,
        salaId: formData.sala_id,
        inicio: this.crearFechaHoraISO(formData.fecha, formData.hora),
        precio: parseFloat(formData.precio)
      };

      // Verificar si cambió el estado de cancelada
      const estadoFormulario = formData.estado === 'CANCELADA';
      const estadoActual = this.funcionSeleccionada.cancelada;
      
      console.log('🔄 Actualizando función con datos:', updateData);
      
      this.funcionesService.updateFuncion(this.funcionSeleccionada.id, updateData).subscribe({
        next: () => {
          // Si cambió el estado de cancelada, manejar por separado
          if (estadoFormulario !== estadoActual) {
            const operacionEstado = estadoFormulario ? 
              this.funcionesService.cancelarFuncion(this.funcionSeleccionada!.id) : 
              this.funcionesService.reactivarFuncion(this.funcionSeleccionada!.id);
            
            operacionEstado.subscribe({
              next: () => {
                this.guardando = false;
                alert('Función actualizada exitosamente');
                this.mostrarModalFuncion = false;
                this.cargarFunciones();
              },
              error: (error) => {
                this.guardando = false;
                console.error('Error al cambiar estado:', error);
                alert(`Error al cambiar el estado: ${error.error?.message || 'Error desconocido'}`);
              }
            });
          } else {
            this.guardando = false;
            alert('Función actualizada exitosamente');
            this.mostrarModalFuncion = false;
            this.cargarFunciones();
          }
        },
        error: (error) => {
          this.guardando = false;
          console.error('Error al actualizar función:', error);
          
          const mensaje = error.error?.message || 'Error desconocido';
          
          // Detectar si es un error de conflicto directo (409)
          if (error.status === 409 || mensaje.includes('Ya existe una función') || mensaje.includes('se solapan')) {
            this.mostrarMensajeConflicto(mensaje, false);
          }
          // Detectar si es una advertencia por funciones cercanas (400 con mensaje de advertencia)
          else if (error.status === 400 && mensaje.includes('ADVERTENCIA') && mensaje.includes('funciones muy cercanas')) {
            this.manejarAdvertenciaFuncionesCercanas(mensaje, updateData);
          } else {
            alert(`Error al actualizar la función: ${mensaje}`);
          }
        }
      });
    } else {
      // Crear nueva función
      const createData: CreateFuncionRequest = {
        peliculaId: formData.pelicula_id,
        salaId: formData.sala_id,
        inicio: this.crearFechaHoraISO(formData.fecha, formData.hora),
        precio: parseFloat(formData.precio)
      };

      this.funcionesService.createFuncion(createData).subscribe({
        next: () => {
          this.guardando = false;
          alert('Función creada exitosamente');
          this.mostrarModalFuncion = false;
          this.cargarFunciones();
        },
        error: (error) => {
          this.guardando = false;
          console.error('Error al crear función:', error);
          
          const mensaje = error.error?.message || 'Error desconocido';
          
          // Detectar si es un error de conflicto directo (409)
          if (error.status === 409 || mensaje.includes('Ya existe una función') || mensaje.includes('se solapan')) {
            this.mostrarMensajeConflicto(mensaje, true);
          }
          // Detectar si es una advertencia por funciones cercanas (400 con mensaje de advertencia)
          else if (error.status === 400 && mensaje.includes('ADVERTENCIA') && mensaje.includes('funciones muy cercanas')) {
            this.manejarAdvertenciaFuncionesCercanasCreacion(mensaje, createData);
          } else {
            alert(`Error al crear la función: ${mensaje}`);
          }
        }
      });
    }
  }

  verDetalles(funcion: Funcion): void {
    this.funcionSeleccionada = funcion;
    this.mostrarModalDetalles = true;
  }

  cambiarEstado(funcion: Funcion): void {
    const esCancelada = funcion.cancelada;
    const mensaje = esCancelada ? 
      '¿Está seguro de que desea reactivar esta función?' : 
      '¿Está seguro de que desea cancelar esta función?';

    if (confirm(mensaje)) {
      const operacion = esCancelada ? 
        this.funcionesService.reactivarFuncion(funcion.id) : 
        this.funcionesService.cancelarFuncion(funcion.id);

      operacion.subscribe({
        next: (response) => {
          const estadoTexto = esCancelada ? 'reactivada' : 'cancelada';
          alert(`Función ${estadoTexto} exitosamente`);
          this.cargarFunciones();
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          const mensaje = error.error?.message || 'Error desconocido';
          alert(`Error al cambiar el estado: ${mensaje}`);
        }
      });
    }
  }

  eliminarFuncion(funcion: Funcion): void {
    const confirmar = confirm(
      `¿Estás seguro de que quieres eliminar permanentemente la función de "${funcion.pelicula?.titulo || 'función'}" el ${new Date(funcion.inicio).toLocaleString()}?\n\n` +
      'Esta acción no se puede deshacer y se eliminará toda la información asociada.'
    );
    
    if (confirmar) {
      this.funcionesService.deleteFuncion(funcion.id).subscribe({
        next: () => {
          alert('Función eliminada exitosamente');
          this.cargarFunciones();
        },
        error: (error) => {
          console.error('Error al eliminar función:', error);
          alert(`Error al eliminar la función: ${error.error?.message || 'Error desconocido'}`);
        }
      });
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.funcionesPaginadas.totalPages) {
      this.paginaActual = pagina;
      this.cargarFunciones();
    }
  }

  getPaginas(): number[] {
    const totalPages = this.funcionesPaginadas.totalPages;
    const currentPage = this.funcionesPaginadas.page;
    const pages: number[] = [];
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  calcularPorcentajeOcupacion(funcion: Funcion): number {
    if (!funcion.sala) return 0;
    const capacidadTotal = (funcion.sala.filas || 0) * (funcion.sala.asientosPorFila || 0);
    if (capacidadTotal === 0) return 0;
    
    const boletosVendidos = funcion._count?.boletos || 0;
    return Math.round((boletosVendidos / capacidadTotal) * 100);
  }

  getBoletosVendidos(funcion: Funcion): number {
    return funcion._count?.boletos || 0;
  }

  getCapacidadTotal(funcion: Funcion): number {
    if (!funcion.sala) return 0;
    return (funcion.sala.filas || 0) * (funcion.sala.asientosPorFila || 0);
  }



  private crearFechaHoraISO(fecha: string, hora: string): string {
    // Crear fecha en zona horaria local y convertir a ISO
    const fechaCompleta = `${fecha}T${hora}:00`;
    const fechaObj = new Date(fechaCompleta);
    
    // Log para debugging
    console.log('🕐 Conversión de fecha:', {
      input: fechaCompleta,
      fechaObj: fechaObj,
      iso: fechaObj.toISOString()
    });
    
    return fechaObj.toISOString();
  }

  private manejarAdvertenciaFuncionesCercanas(mensaje: string, updateData: UpdateFuncionRequest): void {
    // Limpiar el mensaje de advertencia
    const mensajeLimpio = mensaje
      .replace('⚠️ ADVERTENCIA: ', '')
      .replace('¿Deseas continuar de todas formas?', '');

    const confirmar = confirm(
      `⚠️ FUNCIONES MUY CERCANAS DETECTADAS\n\n${mensajeLimpio}\n\n` +
      `🎬 RECOMENDACIÓN:\n` +
      `- Deja al menos 60 minutos entre funciones\n` +
      `- Esto permite tiempo para limpieza de sala\n` +
      `- Evita aglomeraciones en entrada/salida\n\n` +
      `❓ ¿Deseas continuar con este horario de todas formas?`
    );

    if (confirmar) {
      // Si el usuario confirma, forzar la actualización
      console.log('🔄 Usuario confirmó actualización con funciones cercanas');
      this.forzarActualizacionFuncion(updateData);
    } else {
      // Si cancela, permitir que edite el horario
      alert('💡 Por favor, elige un horario con más separación entre funciones.');
    }
  }

  private manejarAdvertenciaFuncionesCercanasCreacion(mensaje: string, createData: CreateFuncionRequest): void {
    // Limpiar el mensaje de advertencia
    const mensajeLimpio = mensaje
      .replace('⚠️ ADVERTENCIA: ', '')
      .replace('¿Deseas continuar de todas formas?', '');

    const confirmar = confirm(
      `⚠️ FUNCIONES MUY CERCANAS DETECTADAS\n\n${mensajeLimpio}\n\n` +
      `🎬 RECOMENDACIÓN:\n` +
      `- Deja al menos 60 minutos entre funciones\n` +
      `- Esto permite tiempo para limpieza de sala\n` +
      `- Evita aglomeraciones en entrada/salida\n\n` +
      `❓ ¿Deseas continuar con este horario de todas formas?`
    );

    if (confirmar) {
      // Si el usuario confirma, forzar la creación
      console.log('🔄 Usuario confirmó creación con funciones cercanas');
      this.forzarCreacionFuncion(createData);
    } else {
      // Si cancela, permitir que edite el horario
      alert('💡 Por favor, elige un horario con más separación entre funciones.');
    }
  }

  private forzarCreacionFuncion(createData: CreateFuncionRequest): void {
    // Agregar flag para forzar la creación saltándose las advertencias
    const createDataForzado = { ...createData, forzarCreacion: true };
    this.guardando = true;
    
    console.log('🔄 Forzando creación con datos:', createDataForzado);
    
    this.funcionesService.createFuncion(createDataForzado).subscribe({
      next: () => {
        this.guardando = false;
        alert('✅ Función creada exitosamente (con funciones cercanas detectadas)');
        this.mostrarModalFuncion = false;
        this.cargarFunciones();
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al forzar creación:', error);
        alert(`Error al crear la función: ${error.error?.message || 'Error desconocido'}`);
      }
    });
  }

  private forzarActualizacionFuncion(updateData: UpdateFuncionRequest): void {
    // Agregar flag para forzar la actualización saltándose las advertencias
    const updateDataForzado = { ...updateData, forzarActualizacion: true };
    this.guardando = true;
    
    console.log('🔄 Forzando actualización con datos:', updateDataForzado);
    
    this.funcionesService.updateFuncion(this.funcionSeleccionada!.id, updateDataForzado).subscribe({
      next: () => {
        this.guardando = false;
        alert('✅ Función actualizada exitosamente (con funciones cercanas detectadas)');
        this.mostrarModalFuncion = false;
        this.cargarFunciones();
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al forzar actualización:', error);
        alert(`Error al actualizar la función: ${error.error?.message || 'Error desconocido'}`);
      }
    });
  }

  private mostrarMensajeConflicto(mensaje: string, esCreacion: boolean = true): void {
    const accion = esCreacion ? 'crear' : 'actualizar';
    const titulo = esCreacion ? 'CREAR FUNCIÓN' : 'ACTUALIZAR FUNCIÓN';
    
    // Crear mensaje más legible
    let mensajeLimpio = mensaje;
    
    // Reemplazar emojis y texto técnico por versión más amigable
    mensajeLimpio = mensajeLimpio
      .replace(/⚠️/g, '')
      .replace(/🔄/g, '')
      .replace(/Error al actualizar: /g, '')
      .replace(/Nueva función programada:/g, 'Horario que intentas asignar:')
      .replace(/Tu función programada:/g, 'Horario que intentas asignar:');
    
    const mensajeFinal = `❌ NO SE PUEDE ${titulo.toUpperCase()}\n\n${mensajeLimpio}\n\n💡 SOLUCIÓN:\n- Elige un horario diferente\n- Verifica que no coincida con otras funciones\n- Recuerda que debe haber 30 min de separación entre funciones`;
    
    alert(mensajeFinal);
  }

  cerrarModal(event?: Event): void {
    this.mostrarModalFuncion = false;
    this.funcionForm.reset();
  }

  cerrarModalDetalles(event?: Event): void {
    this.mostrarModalDetalles = false;
    this.funcionSeleccionada = null;
  }
}