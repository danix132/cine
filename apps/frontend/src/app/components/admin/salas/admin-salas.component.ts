import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SalasService } from '../../../services/salas.service';
import { Sala, CreateSalaRequest, UpdateSalaRequest, Asiento, AsientoEstado } from '../../../models/sala.model';

@Component({
  selector: 'app-admin-salas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-salas.component.html',
  styleUrls: ['./admin-salas.component.scss']
})
export class AdminSalasComponent implements OnInit {
  salas: Sala[] = [];
  salasFiltradas: Sala[] = [];
  salaSeleccionada: Sala | null = null;
  salaForm: FormGroup;
  
  loading = false;
  guardando = false;
  modoEdicion = false;
  capacidadTotal = 0;
  
  // Control de modales
  mostrarModalSala = false;
  mostrarModalDetalles = false;
  mostrarModalAsientos = false;
  
  // Gestión de asientos dañados
  salaParaAsientos: Sala | null = null;
  asientosParaGestion: any[] = [];
  asientosDanadosSeleccionados: Set<string> = new Set();
  guardandoAsientos = false;
  
  // Filtros
  filtroBusqueda = '';
  filtroCapacidad = '';
  filtroEstado = '';
  filtroCapacidadMin = 0;

  constructor(
    private salasService: SalasService,
    private formBuilder: FormBuilder
  ) {
    this.salaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      filas: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      asientosPorFila: ['', [Validators.required, Validators.min(1), Validators.max(30)]]
    });
  }

  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas(): void {
    this.loading = true;
    this.salasService.getSalas().subscribe({
      next: (response) => {
        this.salas = (response.data || []).map(sala => ({
          ...sala,
          // Calcular asientos dañados desde el array de asientos
          asientosDanados: sala.asientos?.filter(asiento => asiento.estado === 'DANADO').length || 0
        }));
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar salas:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.salas];

    // Filtro de búsqueda
    if (this.filtroBusqueda.trim()) {
      const termino = this.filtroBusqueda.toLowerCase().trim();
      resultado = resultado.filter(sala => 
        sala.nombre.toLowerCase().includes(termino)
      );
    }

    // Filtro de capacidad
    if (this.filtroCapacidad) {
      resultado = resultado.filter(sala => {
        const capacidad = sala.filas * sala.asientosPorFila;
        switch (this.filtroCapacidad) {
          case 'pequena':
            return capacidad <= 50;
          case 'mediana':
            return capacidad > 50 && capacidad <= 100;
          case 'grande':
            return capacidad > 100;
          default:
            return true;
        }
      });
    }

    // Filtro de estado (simulado)
    if (this.filtroEstado) {
      // Por ahora todas las salas están activas, 
      // en el futuro se puede agregar un campo de estado
      if (this.filtroEstado === 'mantenimiento') {
        resultado = resultado.filter(() => false); // No hay salas en mantenimiento
      }
    }

    // Filtro de capacidad mínima (mantener compatibilidad)
    if (this.filtroCapacidadMin > 0) {
      resultado = resultado.filter(sala => 
        (sala.filas * sala.asientosPorFila) >= this.filtroCapacidadMin
      );
    }

    this.salasFiltradas = resultado;
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroCapacidad = '';
    this.filtroEstado = '';
    this.filtroCapacidadMin = 0;
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return this.filtroBusqueda.trim() !== '' || 
           this.filtroCapacidad !== '' || 
           this.filtroEstado !== '' || 
           this.filtroCapacidadMin > 0;
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtroBusqueda.trim()) count++;
    if (this.filtroCapacidad) count++;
    if (this.filtroEstado) count++;
    if (this.filtroCapacidadMin > 0) count++;
    return count;
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.salaSeleccionada = null;
    this.salaForm.reset();
    this.capacidadTotal = 0;
    this.mostrarModalSala = true;
  }

  editarSala(sala: Sala): void {
    console.log('🔧 Editando sala:', sala);
    this.modoEdicion = true;
    this.salaSeleccionada = sala;
    
    const patchData = {
      nombre: sala.nombre,
      filas: sala.filas,
      asientosPorFila: sala.asientosPorFila
    };
    
    console.log('🔧 Datos para patchValue:', patchData);
    
    this.salaForm.patchValue(patchData);
    
    console.log('🔧 Valores del formulario después del patch:', this.salaForm.value);
    console.log('🔧 Estado del formulario:', {
      valid: this.salaForm.valid,
      pristine: this.salaForm.pristine,
      dirty: this.salaForm.dirty
    });
    
    this.calcularCapacidad();
    this.mostrarModalSala = true;
  }

  verDetalles(sala: Sala): void {
    console.log('📋 Viendo detalles de sala:', sala.nombre);
    
    // Cargar los detalles completos de la sala incluyendo asientos
    this.cargarDetallesSala(sala.id);
    this.mostrarModalDetalles = true;
  }

  gestionarAsientos(sala: Sala): void {
    console.log('Gestionando asientos de:', sala.nombre);
    this.salaParaAsientos = sala;
    this.cargarAsientosParaGestion();
    this.mostrarModalAsientos = true;
  }

  eliminarSala(sala: Sala): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la sala "${sala.nombre}"?`)) {
      this.salasService.deleteSala(sala.id).subscribe({
        next: () => {
          this.cargarSalas();
          console.log('Sala eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar sala:', error);
          alert('Error al eliminar la sala. Puede que tenga funciones asociadas.');
        }
      });
    }
  }

  guardarSala(): void {
    if (this.salaForm.valid) {
      this.guardando = true;
      const salaData = {
        ...this.salaForm.value,
        filas: Number(this.salaForm.value.filas),
        asientosPorFila: Number(this.salaForm.value.asientosPorFila)
      };

      console.log('📝 Guardando sala:', {
        modoEdicion: this.modoEdicion,
        salaSeleccionada: this.salaSeleccionada,
        salaData: salaData,
        formValid: this.salaForm.valid,
        formValue: this.salaForm.value,
        salaDataTipos: {
          nombre: typeof salaData.nombre,
          filas: typeof salaData.filas,
          asientosPorFila: typeof salaData.asientosPorFila
        }
      });

      if (this.modoEdicion && this.salaSeleccionada) {
        console.log('🔄 Actualizando sala con ID:', this.salaSeleccionada.id);
        this.salasService.updateSala(this.salaSeleccionada.id, salaData).subscribe({
          next: (response) => {
            console.log('✅ Sala actualizada exitosamente:', response);
            this.cargarSalas();
            this.cerrarModal();
            this.guardando = false;
          },
          error: (error) => {
            console.error('❌ Error al actualizar sala:', error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error details:', error.error);
            this.guardando = false;
          }
        });
      } else {
        this.salasService.createSala(salaData).subscribe({
          next: () => {
            this.cargarSalas();
            this.cerrarModal();
            this.guardando = false;
            console.log('Sala creada exitosamente');
          },
          error: (error) => {
            console.error('Error al crear sala:', error);
            this.guardando = false;
          }
        });
      }
    }
  }

  calcularCapacidad(): void {
    const filas = this.salaForm.get('filas')?.value || 0;
    const asientosPorFila = this.salaForm.get('asientosPorFila')?.value || 0;
    this.capacidadTotal = filas * asientosPorFila;
    
    console.log('🧮 Capacidad calculada:', {
      filas: filas,
      asientosPorFila: asientosPorFila,
      capacidadTotal: this.capacidadTotal,
      tipoFilas: typeof filas,
      tipoAsientos: typeof asientosPorFila,
      formValue: this.salaForm.value,
      formValid: this.salaForm.valid
    });
  }

  cerrarModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.mostrarModalSala = false;
    this.modoEdicion = false;
    this.salaSeleccionada = null;
    this.salaForm.reset();
    this.capacidadTotal = 0;
  }

  cerrarModalDetalles(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.mostrarModalDetalles = false;
    this.salaSeleccionada = null;
  }

  // Método de debugging para verificar el estado del formulario
  debugFormulario(): void {
    console.log('🐛 DEBUG - Estado completo del formulario:');
    console.log('🐛 Valores:', this.salaForm.value);
    console.log('🐛 Válido:', this.salaForm.valid);
    console.log('🐛 Errores:', this.salaForm.errors);
    console.log('🐛 Controles individuales:');
    Object.keys(this.salaForm.controls).forEach(key => {
      const control = this.salaForm.get(key);
      console.log(`🐛 ${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors,
        pristine: control?.pristine,
        touched: control?.touched
      });
    });
    console.log('🐛 Modo edición:', this.modoEdicion);
    console.log('🐛 Sala seleccionada:', this.salaSeleccionada);
  }

  // === GESTIÓN DE ASIENTOS DAÑADOS ===
  
  cargarAsientosParaGestion(): void {
    if (!this.salaParaAsientos) return;
    
    this.loading = true;
    this.salasService.getSala(this.salaParaAsientos.id).subscribe({
      next: (sala) => {
        this.asientosParaGestion = sala.asientos || [];
        this.asientosDanadosSeleccionados.clear();
        this.estadosAsientos.clear();
        
        // Cargar TODOS los asientos con sus estados (incluyendo DISPONIBLE)
        // Generar todos los asientos posibles basados en la configuración de la sala
        if (this.salaParaAsientos) {
          for (let fila = 1; fila <= this.salaParaAsientos.filas; fila++) {
            for (let numero = 1; numero <= this.salaParaAsientos.asientosPorFila; numero++) {
              const asientoId = `${fila}-${numero}`;
              
              // Buscar el asiento en los datos cargados
              const asientoExistente = this.asientosParaGestion.find(
                a => a.fila === fila && a.numero === numero
              );
              
              // Establecer el estado (por defecto DISPONIBLE si no existe)
              const estado = asientoExistente?.estado || 'DISPONIBLE';
              this.estadosAsientos.set(asientoId, estado);
              
              if (estado === 'DANADO') {
                this.asientosDanadosSeleccionados.add(asientoId);
              }
            }
          }
        }
        
        console.log('🔧 Asientos cargados:', this.asientosParaGestion.length);
        console.log('🔧 Estados inicializados:', this.estadosAsientos.size);
        console.log('🔧 Map de estados:', this.estadosAsientos);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asientos:', error);
        this.loading = false;
      }
    });
  }

  // Map para almacenar el estado de cada asiento (key: "fila-numero", value: estado)
  estadosAsientos = new Map<string, string>();

  toggleEstadoAsiento(fila: number, numero: number): void {
    const asientoId = `${fila}-${numero}`;
    const estadoActual = this.estadosAsientos.get(asientoId) || 'DISPONIBLE';
    
    // Ciclo: DISPONIBLE → DANADO → NO_EXISTE → DISPONIBLE
    let nuevoEstado: string;
    if (estadoActual === 'DISPONIBLE') {
      nuevoEstado = 'DANADO';
    } else if (estadoActual === 'DANADO') {
      nuevoEstado = 'NO_EXISTE';
    } else {
      nuevoEstado = 'DISPONIBLE';
    }
    
    this.estadosAsientos.set(asientoId, nuevoEstado);
    
    // Actualizar el set de asientos dañados para compatibilidad
    if (nuevoEstado === 'DANADO') {
      this.asientosDanadosSeleccionados.add(asientoId);
    } else {
      this.asientosDanadosSeleccionados.delete(asientoId);
    }
    
    console.log(`🪑 Asiento ${asientoId}: ${estadoActual} → ${nuevoEstado}`);
  }

  getEstadoAsiento(fila: number, numero: number): string {
    const asientoId = `${fila}-${numero}`;
    return this.estadosAsientos.get(asientoId) || 'DISPONIBLE';
  }

  toggleAsientoDanado(fila: number, numero: number): void {
    const asientoId = `${fila}-${numero}`;
    
    if (this.asientosDanadosSeleccionados.has(asientoId)) {
      this.asientosDanadosSeleccionados.delete(asientoId);
    } else {
      this.asientosDanadosSeleccionados.add(asientoId);
    }
    
    console.log('🪑 Asientos dañados seleccionados:', this.asientosDanadosSeleccionados.size);
  }

  esAsientoDanado(fila: number, numero: number): boolean {
    return this.asientosDanadosSeleccionados.has(`${fila}-${numero}`);
  }

  guardarAsientosDanados(): void {
    if (!this.salaParaAsientos) return;

    this.guardandoAsientos = true;

    console.log('💾 Map de estados completo:', this.estadosAsientos);
    console.log('💾 Tamaño del Map:', this.estadosAsientos.size);

    // Convertir Map a array de objetos con fila, numero y estado
    // IMPORTANTE: Solo enviamos asientos que NO sean DISPONIBLE
    const asientosDanados: Array<{fila: number, numero: number, estado: AsientoEstado}> = [];
    
    this.estadosAsientos.forEach((estado, asientoId) => {
      console.log(`💾 Procesando asiento ${asientoId}: ${estado}`);
      // Solo incluir asientos que NO sean DISPONIBLE
      if (estado !== 'DISPONIBLE') {
        const [fila, numero] = asientoId.split('-').map(Number);
        asientosDanados.push({ fila, numero, estado: estado as AsientoEstado });
      }
    });

    console.log('💾 Array de asientos a enviar:', asientosDanados);
    console.log('💾 Total asientos con estado especial:', asientosDanados.length);

    // Siempre enviar el array, incluso si está vacío (significa que todos están disponibles)
    const payload = { asientosDanados };
    console.log('💾 Payload final:', JSON.stringify(payload, null, 2));

    this.salasService.updateAsientosDanados(this.salaParaAsientos.id, payload).subscribe({
      next: (response) => {
        console.log('✅ Asientos dañados actualizados exitosamente:', response);
        
        // Si el modal de detalles está abierto para la misma sala, actualizarla
        if (this.mostrarModalDetalles && this.salaSeleccionada && this.salaParaAsientos && 
            this.salaSeleccionada.id === this.salaParaAsientos.id) {
          console.log('🔄 Actualizando datos del modal de detalles');
          this.cargarDetallesSala(this.salaSeleccionada.id);
        }
        
        this.cerrarModalAsientos();
        this.cargarSalas(); // Recargar lista de salas
        this.guardandoAsientos = false;
      },
      error: (error) => {
        console.error('❌ Error al actualizar asientos dañados:', error);
        this.guardandoAsientos = false;
      }
    });
  }

  cerrarModalAsientos(): void {
    this.mostrarModalAsientos = false;
    this.salaParaAsientos = null;
    this.asientosParaGestion = [];
    this.asientosDanadosSeleccionados.clear();
  }

  // Método para obtener las filas organizadas
  getFilasOrganizadas(): any[][] {
    if (!this.salaParaAsientos) return [];

    const filas: any[][] = [];
    
    for (let fila = 1; fila <= this.salaParaAsientos.filas; fila++) {
      const asientosDeFila = this.asientosParaGestion.filter(asiento => asiento.fila === fila)
        .sort((a, b) => a.numero - b.numero);
      filas.push(asientosDeFila);
    }
    
    return filas;
  }

  // Método para recargar los detalles de una sala específica
  cargarDetallesSala(salaId: string): void {
    this.salasService.getSala(salaId).subscribe({
      next: (sala) => {
        this.salaSeleccionada = sala;
        console.log('🔄 Detalles de sala actualizados:', sala);
      },
      error: (error) => {
        console.error('❌ Error al recargar detalles de sala:', error);
      }
    });
  }

  // Utilidades para la vista previa
  getFilasArray(sala: Sala): number[] {
    return Array.from({ length: sala.filas }, (_, i) => i + 1);
  }

  getAsientosArray(sala: Sala): number[] {
    return Array.from({ length: sala.asientosPorFila }, (_, i) => i + 1);
  }

  getLabelFila(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  }

  getAsientosDeFila(cantidad: number): number[] {
    return Array.from({ length: cantidad }, (_, i) => i + 1);
  }

  // Métodos para dividir asientos en grupos con pasillo central
  getPrimerGrupoAsientos(sala: Sala): number[] {
    const mitad = Math.floor(sala.asientosPorFila / 2);
    return Array.from({ length: mitad }, (_, i) => i + 1);
  }

  getSegundoGrupoAsientos(sala: Sala): number[] {
    const mitad = Math.floor(sala.asientosPorFila / 2);
    const restantes = sala.asientosPorFila - mitad;
    return Array.from({ length: restantes }, (_, i) => i + 1);
  }

  // ✅ Método para verificar si un asiento está dañado en la previa
  esAsientoDanadoEnPrevia(sala: Sala, fila: number, numero: number): boolean {
    if (!sala.asientos || sala.asientos.length === 0) {
      return false;
    }
    return sala.asientos.some(asiento => 
      asiento.fila === fila && asiento.numero === numero && asiento.estado === 'DANADO'
    );
  }

  // Método para obtener el estado de un asiento en la previa
  getEstadoAsientoPrevia(sala: Sala, fila: number, numero: number): string {
    if (!sala.asientos || sala.asientos.length === 0) {
      return 'DISPONIBLE';
    }
    const asiento = sala.asientos.find(a => a.fila === fila && a.numero === numero);
    const estado = asiento?.estado || 'DISPONIBLE';
    
    // Debug: mostrar todos los asientos con estado especial
    if (estado !== 'DISPONIBLE') {
      console.log(`🔍 Sala ${sala.nombre} - Asiento [${fila},${numero}]: ${estado}`, asiento);
    }
    
    return estado;
  }

  // Para el modal de detalles
  getEstadoAsientoModal(fila: number, asiento: number): string {
    if (!this.salaSeleccionada?.asientos) return 'DISPONIBLE';
    
    const asientoReal = this.salaSeleccionada.asientos.find(
      a => a.fila === (fila + 1) && a.numero === (asiento + 1)
    );
    
    return asientoReal?.estado || 'DISPONIBLE';
  }

  // Para el mapa de asientos detallado
  esAsientoDisponible(fila: number, asiento: number): boolean {
    if (!this.salaSeleccionada?.asientos) return true;
    
    // Buscar el asiento específico en la lista de asientos
    const asientoReal = this.salaSeleccionada.asientos.find(
      a => a.fila === (fila + 1) && a.numero === (asiento + 1)
    );
    
    // Si no existe el asiento o está dañado, retorna false
    return asientoReal ? asientoReal.estado === 'DISPONIBLE' : true;
  }

  calcularAsientosDisponibles(): number {
    if (!this.salaSeleccionada?.asientos) {
      return this.salaSeleccionada ? this.salaSeleccionada.filas * this.salaSeleccionada.asientosPorFila : 0;
    }
    
    return this.salaSeleccionada.asientos.filter(asiento => asiento.estado === 'DISPONIBLE').length;
  }

  calcularAsientosDanados(): number {
    if (!this.salaSeleccionada?.asientos) return 0;
    
    return this.salaSeleccionada.asientos.filter(asiento => asiento.estado === 'DANADO').length;
  }

  calcularAsientosNoExisten(): number {
    if (!this.salaSeleccionada?.asientos) return 0;
    
    return this.salaSeleccionada.asientos.filter(asiento => asiento.estado === 'NO_EXISTE').length;
  }

  calcularCapacidadTotal(): number {
    if (!this.salaSeleccionada) return 0;
    const totalPosiciones = this.salaSeleccionada.filas * this.salaSeleccionada.asientosPorFila;
    const noExisten = this.calcularAsientosNoExisten();
    return totalPosiciones - noExisten;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}