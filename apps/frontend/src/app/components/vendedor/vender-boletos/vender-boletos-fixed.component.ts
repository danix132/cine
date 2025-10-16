import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesService } from '../../../services/funciones.service';
import { SalasService } from '../../../services/salas.service';
import { BoletosService } from '../../../services/boletos.service';
import { AuthService } from '../../../services/auth.service';
import { Funcion } from '../../../models/funcion.model';
import { Sala, Asiento, AsientoEstado } from '../../../models/sala.model';
import { Boleto, BoletoEstado } from '../../../models/boleto.model';

@Component({
  selector: 'app-vender-boletos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vender-boletos.component.html',
  styleUrls: ['./vender-boletos.component.scss']
})
export class VenderBoletosComponent implements OnInit {
  funciones: Funcion[] = [];
  funcionesFiltradas: Funcion[] = [];
  funcionSeleccionada: Funcion | null = null;
  salaDetalles: Sala | null = null;
  boletosExistentes: Boleto[] = [];
  
  // Estados de loading
  loading = false;
  loadingSala = false;
  procesandoVenta = false;
  
  // Estados del modal
  mostrarModalConfirmacion = false;
  mostrarModalExito = false;
  
  // Datos de la venta
  asientosSeleccionados = new Set<string>();
  totalVenta = 0;
  boletosCreados: Boleto[] = [];
  
  // Filtros
  filtroTitulo = '';
  filtroFecha = '';
  filtroHora = '';
  
  // Enums para el template
  AsientoEstado = AsientoEstado;
  BoletoEstado = BoletoEstado;

  constructor(
    private funcionesService: FuncionesService,
    private salasService: SalasService,
    private boletosService: BoletosService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarFunciones();
  }

  cargarFunciones(): void {
    this.loading = true;
    console.log('🎬 Cargando funciones disponibles...');
    
    this.funcionesService.getFunciones().subscribe({
      next: (funciones) => {
        console.log('✅ Funciones cargadas:', funciones.length);
        this.funciones = funciones || [];
        this.funcionesFiltradas = [...this.funciones];
        this.loading = false;
        
        // Debug de funciones
        console.log('📋 Primeras 5 funciones:', this.funciones.slice(0, 5).map(f => ({
          id: f.id,
          titulo: f.pelicula?.titulo,
          fecha: f.fecha,
          hora: f.hora,
          sala: f.sala?.nombre
        })));
      },
      error: (error) => {
        console.error('❌ Error al cargar funciones:', error);
        this.loading = false;
        this.funciones = [];
        this.funcionesFiltradas = [];
      }
    });
  }

  aplicarFiltros(): void {
    this.funcionesFiltradas = this.funciones.filter(funcion => {
      const matchTitulo = !this.filtroTitulo || 
        funcion.pelicula?.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase());
      const matchFecha = !this.filtroFecha || 
        funcion.fecha === this.filtroFecha;
      const matchHora = !this.filtroHora || 
        funcion.hora.includes(this.filtroHora);
      
      return matchTitulo && matchFecha && matchHora;
    });
  }

  seleccionarFuncion(funcion: Funcion): void {
    console.log('🎯 Función seleccionada:', funcion);
    this.funcionSeleccionada = funcion;
    this.loadingSala = true;
    this.asientosSeleccionados.clear();
    this.totalVenta = 0;
    
    this.cargarSalaYBoletos(funcion.salaId);
  }

  cargarSalaYBoletos(salaId: string): void {
    console.log('🏛️ Cargando sala:', salaId);
    
    this.salasService.getSala(salaId).subscribe({
      next: (sala) => {
        console.log('✅ Sala cargada:', sala);
        this.salaDetalles = sala;
        this.loadingSala = false;
        
        // Debug de asientos
        console.log('💺 Total asientos:', sala.asientos?.length || 0);
        
        // Cargar boletos existentes después de cargar la sala
        this.cargarBoletosExistentes();
      },
      error: (error) => {
        console.error('❌ Error al cargar sala:', error);
        this.loadingSala = false;
      }
    });
  }

  cargarBoletosExistentes(): void {
    if (!this.funcionSeleccionada) {
      console.log('❌ No hay función seleccionada para cargar boletos');
      return;
    }

    console.log('🎫 Cargando boletos existentes para función:', this.funcionSeleccionada.id);
    
    this.boletosService.getBoletosPorFuncion(this.funcionSeleccionada.id).subscribe({
      next: (boletos) => {
        // Filtrar solo boletos activos (no cancelados)
        this.boletosExistentes = (boletos || []).filter(b => 
          b.estado === 'PAGADO' || b.estado === 'RESERVADO'
        );
        
        console.log('✅ Boletos existentes cargados:', this.boletosExistentes.length);
        console.log('📋 Detalle de boletos activos:', this.boletosExistentes.map(b => ({
          id: b.id,
          asientoId: b.asientoId,
          estado: b.estado,
          asiento: b.asiento ? `Fila ${b.asiento.fila}, Asiento ${b.asiento.numero}` : 'Sin asiento'
        })));
        
        // Verificar si los asientos tienen los datos completos
        const boletosSinAsiento = this.boletosExistentes.filter(b => !b.asiento);
        if (boletosSinAsiento.length > 0) {
          console.warn('⚠️ Hay boletos sin información de asiento:', boletosSinAsiento);
        }
        
        // Ejecutar debug después de cargar boletos
        setTimeout(() => {
          this.debugAsientos();
          this.forzarActualizacionVista();
        }, 200);
      },
      error: (error) => {
        console.error('❌ Error al cargar boletos existentes:', error);
        this.boletosExistentes = [];
      }
    });
  }

  private forzarActualizacionVista(): void {
    // Forzar detección de cambios inmediatamente
    this.cdr.detectChanges();
    
    // También forzar después de un timeout para elementos que se renderizan tarde
    setTimeout(() => {
      this.cdr.detectChanges();
      const elementos = document.querySelectorAll('.asiento-vendedor');
      console.log(`🔄 Forzando actualización de ${elementos.length} asientos`);
      
      // Verificar qué asientos están siendo detectados como ocupados
      const ocupados = document.querySelectorAll('.asiento-vendedor.ocupado');
      console.log(`🚫 Asientos marcados como ocupados en DOM: ${ocupados.length}`);
      
      ocupados.forEach((el, index) => {
        console.log(`   ${index + 1}. ${el.textContent?.trim()}`);
      });
    }, 100);
  }

  esAsientoOcupado(asiento: Asiento): boolean {
    if (!asiento || !asiento.id) {
      console.warn('⚠️ Asiento sin ID válido:', asiento);
      return false;
    }

    const boletoOcupante = this.boletosExistentes.find(boleto => {
      const coincideId = boleto.asientoId === asiento.id;
      const estadoOcupado = boleto.estado === 'PAGADO' || boleto.estado === 'RESERVADO';
      
      if (coincideId && estadoOcupado) {
        console.log(`🚫 ASIENTO OCUPADO: ${asiento.fila}-${asiento.numero} (ID: ${asiento.id}) ocupado por boleto ${boleto.id} (Estado: ${boleto.estado})`);
        return true;
      }
      
      return false;
    });
    
    return !!boletoOcupante;
  }

  esAsientoDanado(asiento: Asiento): boolean {
    return asiento.estado === AsientoEstado.DANADO;
  }

  esAsientoSeleccionado(asiento: Asiento): boolean {
    return this.asientosSeleccionados.has(asiento.id);
  }

  toggleAsiento(asiento: Asiento): void {
    console.log(`🪑 Click en asiento - Fila ${asiento.fila}, Número ${asiento.numero} (ID: ${asiento.id})`);
    
    const ocupado = this.esAsientoOcupado(asiento);
    const danado = this.esAsientoDanado(asiento);
    
    console.log(`  - Estado ocupado: ${ocupado}`);
    console.log(`  - Estado dañado: ${danado}`);
    
    if (ocupado) {
      alert('❌ Este asiento ya está ocupado');
      return;
    }
    
    if (danado) {
      alert('⚠️ Este asiento está dañado y no se puede seleccionar');
      return;
    }
    
    if (this.asientosSeleccionados.has(asiento.id)) {
      console.log('➖ Deseleccionando asiento');
      this.asientosSeleccionados.delete(asiento.id);
    } else {
      console.log('➕ Seleccionando asiento');
      this.asientosSeleccionados.add(asiento.id);
    }
    
    console.log(`📊 Total asientos seleccionados: ${this.asientosSeleccionados.size}`);
    this.calcularTotal();
  }

  calcularTotal(): void {
    if (this.funcionSeleccionada) {
      this.totalVenta = this.asientosSeleccionados.size * this.funcionSeleccionada.precio;
    }
  }

  confirmarVenta(): void {
    console.log('🎯 confirmarVenta() ejecutado');
    console.log('📊 Asientos seleccionados:', this.asientosSeleccionados.size);
    
    if (this.asientosSeleccionados.size === 0) {
      alert('Debe seleccionar al menos un asiento');
      return;
    }

    // VERIFICACIÓN ADICIONAL: Recargar boletos antes de confirmar
    console.log('🔄 Verificando disponibilidad de asientos antes de confirmar...');
    this.verificarDisponibilidadAsientos();
  }

  // Verificar disponibilidad en tiempo real antes de procesar
  private verificarDisponibilidadAsientos(): void {
    this.boletosService.getBoletosPorFuncion(this.funcionSeleccionada!.id).subscribe({
      next: (boletos) => {
        console.log('🔍 Verificación en tiempo real - boletos actuales:', boletos?.length || 0);
        
        const boletosActivos = (boletos || []).filter(b => 
          b.estado === 'PAGADO' || b.estado === 'RESERVADO'
        );
        
        // Verificar si algún asiento seleccionado ya está ocupado
        const asientosOcupados: string[] = [];
        
        this.asientosSeleccionados.forEach(asientoId => {
          const yaOcupado = boletosActivos.find(b => b.asientoId === asientoId);
          if (yaOcupado) {
            const asiento = this.salaDetalles?.asientos?.find(a => a.id === asientoId);
            asientosOcupados.push(asiento ? `${asiento.fila}-${asiento.numero}` : asientoId);
          }
        });
        
        if (asientosOcupados.length > 0) {
          console.error('❌ Asientos ocupados detectados:', asientosOcupados);
          alert(`❌ Los siguientes asientos ya fueron vendidos:\n\n${asientosOcupados.join(', ')}\n\n🔄 Actualizando mapa de asientos...`);
          
          // Actualizar datos y limpiar selección
          this.boletosExistentes = boletosActivos;
          this.asientosSeleccionados.clear();
          this.calcularTotal();
          this.forzarActualizacionVista();
          return;
        }
        
        // Si todo está bien, proceder con la venta
        console.log('✅ Todos los asientos están disponibles, procediendo...');
        this.calcularTotal();
        console.log('💰 Total calculado:', this.totalVenta);
        console.log('🎬 Función seleccionada:', this.funcionSeleccionada);
        
        this.mostrarModalConfirmacion = true;
        console.log('🔄 mostrarModalConfirmacion establecido a:', this.mostrarModalConfirmacion);
        
        // Debug: Verificar que el elemento modal se muestra
        setTimeout(() => {
          const modalElement = document.querySelector('.modal');
          if (modalElement) {
            console.log('✅ Modal existe en DOM');
            const styles = getComputedStyle(modalElement);
            console.log('Display:', styles.display, 'Z-index:', styles.zIndex, 'Position:', styles.position);
          } else {
            console.log('❌ Modal NO encontrado en DOM');
          }
        }, 100);
        
        // Force change detection
        setTimeout(() => {
          console.log('⏰ Verificando modal después de timeout:', this.mostrarModalConfirmacion);
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error al verificar disponibilidad:', error);
        alert('Error al verificar disponibilidad de asientos. Intente nuevamente.');
      }
    });
  }

  procesarVenta(): void {
    console.log('🚀 Iniciando procesarVenta()');
    
    if (!this.funcionSeleccionada) {
      console.log('❌ No hay función seleccionada');
      return;
    }

    console.log('📋 Función seleccionada:', this.funcionSeleccionada);
    console.log('💺 Asientos seleccionados:', Array.from(this.asientosSeleccionados));

    this.procesandoVenta = true;
    const boletosPromises: Promise<Boleto>[] = [];

    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 Usuario actual para la venta:', currentUser);
    
    // Verificación adicional del token
    const token = this.authService.getToken();
    console.log('🔑 Token disponible:', !!token, token ? `${token.length} chars` : 'No token');
    
    if (!currentUser || !token) {
      console.error('❌ Usuario no autenticado o token faltante');
      this.procesandoVenta = false;
      alert('Error de autenticación. Por favor inicie sesión nuevamente.');
      return;
    }
    
    if (!currentUser.id) {
      console.error('❌ ID de usuario faltante');
      this.procesandoVenta = false;
      alert('Error: ID de usuario no encontrado.');
      return;
    }

    // Crear un boleto por cada asiento seleccionado - directamente como PAGADO
    this.asientosSeleccionados.forEach((asientoId, index) => {
      const boletoRequest = {
        funcionId: this.funcionSeleccionada!.id,
        asientoId: asientoId,
        usuarioId: currentUser.id,
        vendedorId: currentUser.id,  // 🆕 Agregar vendedorId para reportes
        precio: this.funcionSeleccionada!.precio,
        estado: 'PAGADO' as BoletoEstado  // Crear directamente como PAGADO
      };
      
      console.log(`🎫 Creando boleto ${index + 1} (vendedor: ${currentUser.id}):`, boletoRequest);
      
      const boletoObservable = this.boletosService.createBoleto(boletoRequest).toPromise();
      boletosPromises.push(boletoObservable);
    });

    // Procesar todos los boletos
    Promise.all(boletosPromises)
      .then((boletos) => {
        console.log('✅ Todos los boletos creados:', boletos);
        
        // Filtrar boletos exitosos (no undefined)
        this.boletosCreados = boletos.filter(b => b !== undefined) as Boleto[];
        this.procesandoVenta = false;
        this.mostrarModalConfirmacion = false;
        this.mostrarModalExito = true;
        
        // Limpiar selección
        console.log('🧹 Limpiando selección después de venta exitosa');
        this.asientosSeleccionados.clear();
        this.totalVenta = 0;
        
        // Recargar boletos para actualizar la vista
        this.cargarBoletosExistentes();
        
        console.log('✅ Proceso de venta completado exitosamente');
      })
      .catch((error) => {
        console.error('❌ Error completo al procesar venta:', error);
        console.error('📊 Detalles del error:');
        console.error('- Message:', error.message);
        console.error('- Status:', error.status);
        console.error('- Error object:', error.error);
        console.error('- Full response:', error);
        
        this.procesandoVenta = false;
        alert('Error al procesar la venta. Por favor intente nuevamente.');
      });
  }

  cancelarVenta(): void {
    console.log('❌ cancelarVenta() ejecutado');
    
    if (this.procesandoVenta) {
      console.log('⏸️ No se puede cancelar, procesando venta...');
      return; // No permitir cerrar durante procesamiento
    }
    
    this.mostrarModalConfirmacion = false;
    this.asientosSeleccionados.clear();
    this.totalVenta = 0;
    console.log('🔄 Modal cerrado y datos limpiados');
  }

  cerrarModalExito(): void {
    this.mostrarModalExito = false;
    this.boletosCreados = [];
  }

  imprimirBoletos(): void {
    // Implementar lógica de impresión
    console.log('Imprimiendo boletos:', this.boletosCreados);
    // Por ahora solo mostrar en consola
    window.print();
  }

  volver(): void {
    this.funcionSeleccionada = null;
    this.salaDetalles = null;
    this.asientosSeleccionados.clear();
    this.totalVenta = 0;
  }

  volverInicio(): void {
    this.router.navigate(['/vendedor']);
  }

  // Métodos de utilidad para el template
  getFilasArray(sala: Sala): number[] {
    return Array.from({length: sala.filas}, (_, i) => i + 1);
  }

  getLabelFila(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  }

  getPrimerGrupoAsientos(sala: Sala): number[] {
    const mitad = Math.ceil(sala.asientosPorFila / 2);
    return Array.from({length: mitad}, (_, i) => i + 1);
  }

  getSegundoGrupoAsientos(sala: Sala): number[] {
    const mitad = Math.ceil(sala.asientosPorFila / 2);
    const resto = sala.asientosPorFila - mitad;
    return Array.from({length: resto}, (_, i) => i + 1);
  }

  getAsientoPorPosicion(fila: number, numero: number): Asiento | undefined {
    if (!this.salaDetalles?.asientos) return undefined;
    return this.salaDetalles.asientos.find(a => a.fila === fila && a.numero === numero);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatearHora(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio);
  }

  debugAsientos(): void {
    console.log('🔍 DEBUG - Estado de asientos:');
    console.log('- Sala detalles:', this.salaDetalles);
    console.log('- Boletos existentes:', this.boletosExistentes.length);
    
    if (this.salaDetalles) {
      console.log('- Total asientos en sala:', this.salaDetalles.asientos?.length || 0);
      
      // Mostrar ejemplo de los primeros asientos y su estado
      const ejemploAsientos = this.salaDetalles.asientos?.slice(0, 10) || [];
      ejemploAsientos.forEach(asiento => {
        const ocupado = this.esAsientoOcupado(asiento);
        const danado = this.esAsientoDanado(asiento);
        const seleccionado = this.esAsientoSeleccionado(asiento);
        console.log(`  Asiento ${asiento.fila}-${asiento.numero} (${asiento.id}): Ocupado=${ocupado}, Dañado=${danado}, Seleccionado=${seleccionado}`);
      });
      
      // Estadísticas generales
      const total = this.salaDetalles.asientos?.length || 0;
      const ocupados = this.salaDetalles.asientos?.filter(a => this.esAsientoOcupado(a)).length || 0;
      const danados = this.salaDetalles.asientos?.filter(a => this.esAsientoDanado(a)).length || 0;
      
      console.log(`📊 Resumen: ${total} total, ${ocupados} ocupados, ${danados} dañados, ${this.asientosSeleccionados.size} seleccionados`);
    }
  }

  getAsientoContenido(asiento: Asiento): string {
    if (this.esAsientoOcupado(asiento)) return '✗';
    if (this.esAsientoDanado(asiento)) return '⚠';
    if (this.esAsientoSeleccionado(asiento)) return '✓';
    return asiento.numero.toString();
  }
}