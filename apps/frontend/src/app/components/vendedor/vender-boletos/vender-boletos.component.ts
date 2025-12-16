import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesService } from '../../../services/funciones.service';
import { SalasService } from '../../../services/salas.service';
import { BoletosService } from '../../../services/boletos.service';
import { AuthService } from '../../../services/auth.service';
import { TicketPdfService } from '../../../services/ticket-pdf.service';
import { Funcion } from '../../../models/funcion.model';
import { Sala, Asiento, AsientoEstado } from '../../../models/sala.model';
import { Boleto, BoletoEstado, CreateBoletoRequest } from '../../../models/boleto.model';
import * as QRCode from 'qrcode';

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
  imprimiendo = false;
  impresionExitosa = false;
  
  // Estados del modal
  mostrarModalConfirmacion = false;
  mostrarModalExito = false;
  
  // Datos de la venta
  asientosSeleccionados = new Set<string>();
  totalVenta = 0;
  totalVentaCompletada = 0; // Mantiene el total de la venta exitosa para mostrar en el modal
  boletosCreados: Boleto[] = [];
  
  // Filtros
  filtroTitulo = '';
  filtroFecha = '';
  filtroHora = '';
  filtroPelicula = '';
  filtroSala = '';
  
  // Enums para el template
  AsientoEstado = AsientoEstado;
  BoletoEstado = BoletoEstado;

  constructor(
    private funcionesService: FuncionesService,
    private salasService: SalasService,
    private boletosService: BoletosService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ticketPdfService: TicketPdfService
  ) {}

  ngOnInit(): void {
    this.cargarFunciones();
  }

  cargarFunciones(): void {
    this.loading = true;
    console.log('🎬 Cargando funciones disponibles...');
    
    // Solicitar todas las funciones sin límite de paginación
    this.funcionesService.getFunciones({ limit: 1000 }).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta funciones:', response);
        // Si es una respuesta paginada, usar la propiedad data
        const funcionesData = response?.data || response || [];
        this.funciones = Array.isArray(funcionesData) ? funcionesData : [funcionesData];
        
        // Aplicar filtros incluyendo el filtro de funciones vencidas
        this.aplicarFiltros();
        this.loading = false;
        
        console.log('📋 Funciones cargadas:', this.funciones.length);
        // Debug de funciones
        console.log('📋 Primeras 5 funciones:', this.funciones.slice(0, 5).map(f => ({
          id: f.id,
          titulo: f.pelicula?.titulo,
          inicio: f.inicio,
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
      // Filtros de búsqueda
      const matchTitulo = !this.filtroTitulo || 
        funcion.pelicula?.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase());
      const matchPelicula = !this.filtroPelicula || 
        funcion.pelicula?.titulo.toLowerCase().includes(this.filtroPelicula.toLowerCase());
      const matchSala = !this.filtroSala || 
        funcion.sala?.nombre.toLowerCase().includes(this.filtroSala.toLowerCase());
      const matchFecha = !this.filtroFecha || 
        funcion.inicio?.includes(this.filtroFecha);
      const matchHora = !this.filtroHora || 
        funcion.inicio?.includes(this.filtroHora);
      
      // Filtro de funciones vencidas
      const noEstaVencida = !this.deberiaOcultarFuncionesVencidas() || !this.esFuncionVencida(funcion);
      
      return matchTitulo && matchPelicula && matchSala && matchFecha && matchHora && noEstaVencida;
    });
    
    // Debug para ver cuántas funciones se filtraron
    if (this.deberiaOcultarFuncionesVencidas()) {
      const vencidas = this.funciones.filter(f => this.esFuncionVencida(f));
      console.log(`🕐 Funciones vencidas ocultas: ${vencidas.length} de ${this.funciones.length}`);
    }
  }

  limpiarFiltros(): void {
    this.filtroTitulo = '';
    this.filtroPelicula = '';
    this.filtroSala = '';
    this.filtroFecha = '';
    this.filtroHora = '';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroTitulo || this.filtroPelicula || this.filtroSala || this.filtroFecha || this.filtroHora);
  }

  private esFuncionVencida(funcion: Funcion): boolean {
    if (!funcion.inicio) {
      return false;
    }
    
    const fechaInicio = new Date(funcion.inicio);
    const ahora = new Date();
    
    // Considerar vencida si pasaron más de 2 horas desde el inicio
    // Esto permite vender boletos hasta 2 horas después del inicio
    const dosHorasEnMs = 2 * 60 * 60 * 1000;
    return (ahora.getTime() - fechaInicio.getTime()) > dosHorasEnMs;
  }

  private deberiaOcultarFuncionesVencidas(): boolean {
    // Solo ocultar funciones vencidas si NO hay filtros activos
    // Si hay filtros, mostrar todo para que el usuario pueda buscar funciones pasadas
    return !this.hayFiltrosActivos();
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
        // Filtrar solo boletos activos (no cancelados) - incluye VALIDADO
        this.boletosExistentes = (boletos || []).filter(b => 
          b.estado === 'PAGADO' || b.estado === 'RESERVADO' || b.estado === 'VALIDADO'
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
      const estadoOcupado = boleto.estado === 'PAGADO' || boleto.estado === 'RESERVADO' || boleto.estado === 'VALIDADO';
      
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

  // Función para contar asientos disponibles por función específica
  contarAsientosDisponiblesPorFuncion(funcion: Funcion): number {
    if (!funcion.sala) return 0;
    
    const totalAsientos = funcion.sala.filas * funcion.sala.asientosPorFila;
    
    // Contar asientos dañados en la sala
    const asientosDanados = funcion.sala.asientos?.filter(a => 
      a.estado === AsientoEstado.DANADO
    ).length || 0;
    
    // Contar boletos vendidos para esta función específica
    const boletosVendidos = funcion._count?.boletos || 0;
    
    // Asientos disponibles = Total - Dañados - Vendidos
    const disponibles = totalAsientos - asientosDanados - boletosVendidos;
    
    return Math.max(0, disponibles); // Asegurar que no sea negativo
  }

  toggleAsiento(asiento: Asiento): void {
    console.log(`🪑 Click en asiento - Fila ${asiento.fila}, Número ${asiento.numero} (ID: ${asiento.id})`);
    
    // Modo normal de selección de asientos para venta
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
          b.estado === 'PAGADO' || b.estado === 'RESERVADO' || b.estado === 'VALIDADO'
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

    // Obtener el usuario actual (vendedor)
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 Usuario actual (VENDEDOR) para la venta:', currentUser);
    
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

    // Crear los boletos uno por uno con vendedorId para venta de MOSTRADOR
    const asientosArray = Array.from(this.asientosSeleccionados);
    const promesasBoletos = asientosArray.map((asientoId, index) => {
      const boletoRequest: CreateBoletoRequest = {
        funcionId: this.funcionSeleccionada!.id,
        asientoId: asientoId,
        usuarioId: currentUser.id, // El vendedor también es el usuario que compra en mostrador
        vendedorId: currentUser.id, // 🆕 CRITICAL: Agregado vendedorId para crear Pedido
        precio: this.funcionSeleccionada!.precio,
        estado: 'PAGADO' as BoletoEstado
      };
      
      console.log(`🎫 Creando boleto ${index + 1} (vendedor: ${currentUser.id}):`, boletoRequest);
      
      return this.boletosService.createBoleto(boletoRequest).toPromise();
    });
    
    console.log(`💰 Procesando ${asientosArray.length} boletos de mostrador con vendedorId...`);

    // Esperar a que todos los boletos se creen
    Promise.all(promesasBoletos)
      .then((boletos) => {
        // Filtrar valores undefined y verificar que hay boletos
        const boletosValidos = boletos.filter((b): b is Boleto => b !== undefined);
        
        if (!boletosValidos || boletosValidos.length === 0) {
          throw new Error('No se recibieron boletos del servidor');
        }
        
        console.log('✅ Todos los boletos creados exitosamente (MOSTRADOR con vendedorId):', boletosValidos);
        console.log('📋 Asientos:', boletosValidos.map((b: Boleto) => b.asiento ? `${b.asiento.fila}-${b.asiento.numero}` : 'Sin asiento').join(', '));
        
        // Guardar los boletos creados
        this.boletosCreados = boletosValidos;
        this.procesandoVenta = false;
        this.mostrarModalConfirmacion = false;
        
        // Guardar el total antes de limpiar
        this.totalVentaCompletada = this.totalVenta;
        console.log('💰 Total de venta completada guardado:', this.totalVentaCompletada);
        
        this.mostrarModalExito = true;
        
        // Limpiar selección
        console.log('🧹 Limpiando selección después de venta exitosa');
        this.asientosSeleccionados.clear();
        this.totalVenta = 0;
        
        // Recargar boletos para actualizar la vista
        this.cargarBoletosExistentes();
        
        console.log('✅ Proceso de venta completado exitosamente con vendedorId');
      })
      .catch((error) => {
        console.error('❌ Error completo al procesar venta:', error);
        console.error('📊 Detalles del error:');
        console.error('- Message:', error.message);
        console.error('- Status:', error.status);
        console.error('- Error object:', error.error);
        console.error('- Full response:', error);
        
        // Extraer mensaje específico del backend
        let errorMessage = 'Error al procesar la venta. Por favor intente nuevamente.';
        if (error.error && error.error.message) {
          if (Array.isArray(error.error.message)) {
            errorMessage = 'Errores de validación:\n' + error.error.message.join('\n');
          } else {
            errorMessage = error.error.message;
          }
        }
        
        console.error('🚨 Mensaje de error específico:', errorMessage);
        
        this.procesandoVenta = false;
        alert(errorMessage);
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
    this.totalVentaCompletada = 0; // Limpiar el total después de cerrar el modal
  }

  irANuevaVenta(): void {
    console.log('🔄 Navegando a nueva venta manualmente...');
    
    // Cerrar el modal
    this.cerrarModalExito();
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Navegar a vendedor/boletos
    this.router.navigate(['/vendedor/boletos']).then((success) => {
      if (success) {
        console.log('✅ Navegación manual completada a /vendedor/boletos');
      } else {
        console.warn('⚠️ La navegación manual no se completó, recargando página...');
        window.location.reload();
      }
    }).catch((error) => {
      console.error('❌ Error en navegación manual:', error);
      window.location.href = '/vendedor/boletos';
    });
  }

  private programarRedirecion(): void {
    console.log('📋 Programando redirección a vendedor/boletos...');
    
    setTimeout(() => {
      // Solo redirigir si la impresión fue exitosa
      if (!this.impresionExitosa) {
        console.log('❌ No se redirige porque la impresión no fue exitosa');
        return;
      }
      
      console.log('🔄 Ejecutando redirección a vendedor/boletos después de la impresión exitosa...');
      
      try {
        // Cerrar el modal antes de redireccionar
        this.cerrarModalExito();
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
        
        // Ejecutar redirección
        this.router.navigate(['/vendedor/boletos']).then((success) => {
          if (success) {
            console.log('✅ Redirección completada exitosamente a /vendedor/boletos');
            // Resetear el flag
            this.impresionExitosa = false;
          } else {
            console.warn('⚠️ La redirección no se completó correctamente');
            // Fallback: redirección manual
            window.location.href = '/vendedor/boletos';
          }
        }).catch((error) => {
          console.error('❌ Error al redireccionar:', error);
          // Fallback: redirección manual
          window.location.href = '/vendedor/boletos';
        });
      } catch (error) {
        console.error('❌ Error en el proceso de redirección:', error);
        // Fallback: redirección manual
        window.location.href = '/vendedor/boletos';
      }
    }, 4000); // Aumentar a 4 segundos para dar más tiempo
  }

  async imprimirBoletos(): Promise<void> {
    if (!this.boletosCreados || this.boletosCreados.length === 0) {
      alert('No hay boletos para imprimir');
      return;
    }

    if (this.imprimiendo) {
      console.log('⏸️ Ya se está imprimiendo, esperando...');
      return;
    }

    this.imprimiendo = true;
    this.impresionExitosa = false; // Resetear el flag
    console.log('🖨️ Preparando impresión de boletos:', this.boletosCreados);
    console.log('🎬 Función seleccionada:', this.funcionSeleccionada);

    try {
      // Primero probar si QRCode funciona
      console.log('🧪 Probando generación de QR...');
      const testQR = await QRCode.toDataURL('TEST_QR_CODE');
      console.log('✅ QRCode funciona correctamente, resultado:', testQR.substring(0, 50) + '...');
      
      console.log('📄 Generando HTML de impresión...');
      // Generar HTML para impresión con códigos QR
      const htmlImpresion = await this.generarHTMLImpresion();
      console.log('✅ HTML generado exitosamente, longitud:', htmlImpresion.length);
      
      // Mostrar mensaje al usuario
      console.log('🖨️ Iniciando impresión directa...');
      
      // Crear una nueva ventana para impresión (grande para vista previa)
      const ventanaImpresion = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!ventanaImpresion) {
        alert('No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.');
        return;
      }

      // Escribir el HTML en la nueva ventana
      ventanaImpresion.document.write(htmlImpresion);
      ventanaImpresion.document.close();
      
      // Agregar título a la ventana
      ventanaImpresion.document.title = 'Vista Previa - Recibo de Boletos';
      
      // Esperar a que la ventana cargue completamente y luego imprimir automáticamente
      ventanaImpresion.onload = () => {
        setTimeout(() => {
          ventanaImpresion.print();
          
          // No cerrar automáticamente para que el usuario pueda revisar
          // El usuario puede cerrar manualmente después de imprimir
        }, 300);
      };
      
      console.log('🖨️ Impresión iniciada automáticamente con ventana popup');
      
      // Marcar impresión como exitosa
      this.impresionExitosa = true;
      
      // Mostrar notificación de éxito y próxima redirección
      setTimeout(() => {
        alert('✅ Vista previa de boletos abierta. Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
      }, 500);
      
    } catch (error) {
      console.error('❌ Error al imprimir boletos:', error);
      console.error('❌ Stack trace completo:', (error as Error).stack);
      
      // Intentar con versión simple con QR como respaldo
      try {
        console.log('🔄 Intentando impresión con HTML simple y QR...');
        const htmlSimple = await this.generarHTMLSimpleConQR();
        
        const ventanaImpresion = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (ventanaImpresion) {
          ventanaImpresion.document.write(htmlSimple);
          ventanaImpresion.document.close();
          ventanaImpresion.document.title = 'Vista Previa - Boletos (Versión Simple)';
          ventanaImpresion.onload = () => {
            setTimeout(() => {
              ventanaImpresion.print();
              // No cerrar automáticamente para que el usuario pueda ver
            }, 300);
          };
          
          console.log('🖨️ Impresión con HTML simplificado iniciada automáticamente');
          
          // Marcar impresión como exitosa
          this.impresionExitosa = true;
          
          // Notificación de éxito para respaldo simple
          setTimeout(() => {
            alert('✅ Vista previa de boletos abierta (versión simplificada). Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
          }, 500);
          
          return; // Salir si funcionó
        }
      } catch (simpleError) {
        console.error('❌ Error en impresión simple con QR:', simpleError);
      }
      
      // Como último recurso, intentar sin QR
      try {
        console.log('🔄 Último recurso: impresión sin códigos QR...');
        const htmlBasico = this.generarHTMLSinQR();
        
        const ventanaImpresion = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (ventanaImpresion) {
          ventanaImpresion.document.write(htmlBasico);
          ventanaImpresion.document.close();
          ventanaImpresion.document.title = 'Vista Previa - Boletos (Sin Códigos QR)';
          ventanaImpresion.onload = () => {
            setTimeout(() => {
              ventanaImpresion.print();
              // No cerrar automáticamente para que el usuario pueda ver
            }, 300);
          };
          
          console.log('🖨️ Impresión básica sin QR iniciada automáticamente');
          
          // Marcar impresión como exitosa
          this.impresionExitosa = true;
          
          alert('✅ Vista previa de boletos abierta (sin códigos QR). Los códigos están mostrados como texto. Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
        } else {
          throw new Error('No se pudo abrir ventana de impresión');
        }
      } catch (backupError) {
        console.error('❌ Error en impresión de respaldo:', backupError);
        alert(`Error al generar la impresión: ${(error as Error).message}. Inténtalo nuevamente.`);
      }
    } finally {
      this.imprimiendo = false;
      
      // Programar redirección después de completar la impresión
      this.programarRedirecion();
    }
  }

  private async generarHTMLImpresion(): Promise<string> {
    console.log('🔧 Iniciando generación de HTML...');
    
    // Calcular totales para el recibo
    const totalBoletos = this.boletosCreados.length;
    const precioUnitario = this.funcionSeleccionada?.precio || 0;
    const totalVenta = totalBoletos * precioUnitario;
    const fechaVenta = new Date();
    
    console.log('📊 Datos calculados:', { totalBoletos, precioUnitario, totalVenta });
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Recibo de Venta - Cine Digital</title>
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.3;
            color: #000;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          .recibo-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 10px;
          }
          
          .recibo-header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          
          .cinema-logo {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          
          .recibo-titulo {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #666;
          }
          
          .fecha-hora-venta {
            font-size: 14px;
            color: #888;
          }
          
          .resumen-venta {
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          
          .resumen-titulo {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          
          .resumen-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
            font-size: 14px;
          }
          
          .resumen-item.total {
            border-top: 3px solid #333;
            padding-top: 15px;
            margin-top: 20px;
            font-weight: bold;
            font-size: 18px;
            color: #28a745;
          }
          
          .boletos-seccion {
            margin-bottom: 40px;
          }
          
          .seccion-titulo {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 25px;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          
          .boletos-grid {
            display: grid;
            gap: 15px;
            grid-template-columns: 1fr;
          }
          
          .boleto-item {
            border: 2px solid #333;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            min-height: 120px;
            max-height: 150px;
            page-break-inside: avoid;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 10px;
          }
          
          /* Permitir hasta 3 boletos por página */
          .boleto-item:nth-child(3n+1) {
            page-break-before: auto;
          }
          
          .boleto-info {
            flex: 2;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            font-size: 9px;
          }
          
          .boleto-qr-section {
            flex: 1;
            padding: 10px;
            border-left: 2px dashed #333;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: white;
          }
          
          .boleto-numero {
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 8px;
            display: inline-block;
          }
          
          .pelicula-titulo {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 5px;
          }
          
          .funcion-detalles {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
            margin-bottom: 8px;
          }
          
          .detalle-item {
            padding: 4px 6px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }
          
          .detalle-label {
            font-weight: bold;
            color: #666;
            font-size: 7px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 2px;
          }
          
          .detalle-valor {
            color: #333;
            font-size: 9px;
            font-weight: 600;
          }
          
          .asiento-destacado {
            background: linear-gradient(135deg, #333 0%, #555 100%);
            color: white;
            padding: 6px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            margin: 5px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .precio-boleto {
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            color: #28a745;
            margin-top: 5px;
            padding: 4px;
            background: rgba(40, 167, 69, 0.1);
            border-radius: 4px;
          }
          
          .qr-code img {
            width: 80px !important;
            height: 80px !important;
          }
          
          .codigo-texto {
            font-size: 6px;
            color: #666;
            margin-top: 5px;
            word-break: break-all;
            line-height: 1.2;
          }
          
          /* Control de saltos de página para múltiples boletos */
          .boletos-grid .boleto-item:nth-child(1),
          .boletos-grid .boleto-item:nth-child(2),
          .boletos-grid .boleto-item:nth-child(3) {
            page-break-before: avoid;
            break-inside: avoid;
          }
          
          .boletos-grid .boleto-item:nth-child(4),
          .boletos-grid .boleto-item:nth-child(5),
          .boletos-grid .boleto-item:nth-child(6) {
            page-break-before: avoid;
            break-inside: avoid;
          }
          
          /* Forzar nueva página cada 3 boletos */
          .boletos-grid .boleto-item:nth-child(4) {
            page-break-before: always;
          }
          
          .boletos-grid .boleto-item:nth-child(7) {
            page-break-before: always;
          }
          
          /* Optimización para pantallas pequeñas */
          @media print {
            body {
              font-size: 9px;
            }
            
            .boleto-item {
              min-height: 110px;
              max-height: 130px;
            }
            
            .qr-code img {
              width: 70px !important;
              height: 70px !important;
            }
          }
          
          /* Estilos para vista previa en pantalla */
          @media screen {
            body {
              background: #f5f5f5;
              padding: 20px;
            }
            
            .recibo-container {
              background: white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            /* Botón de impresión flotante para vista previa */
            body::after {
              content: "👆 Presiona Ctrl+P para imprimir o usa el botón de impresión del navegador";
              position: fixed;
              top: 10px;
              right: 10px;
              background: #007bff;
              color: white;
              padding: 10px 15px;
              border-radius: 5px;
              font-size: 12px;
              z-index: 1000;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          }
          
          .qr-code {
            margin-bottom: 20px;
          }
          
          .qr-code img {
            border: 3px solid #333;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .codigo-texto {
            font-size: 9px;
            color: #666;
            word-break: break-all;
            max-width: 140px;
            margin-top: 10px;
            line-height: 1.2;
          }
          
          .recibo-footer {
            border-top: 3px solid #333;
            padding-top: 25px;
            text-align: center;
            margin-top: 50px;
          }
          
          .terminos {
            font-size: 12px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .contacto {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .boleto-item {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .recibo-container {
              padding: 0;
            }
          }
          
          @media screen {
            .recibo-container {
              max-height: 85vh;
              overflow-y: auto;
              border: 1px solid #ddd;
              border-radius: 10px;
            }
            
            .recibo-container::-webkit-scrollbar {
              width: 14px;
            }
            
            .recibo-container::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 7px;
            }
            
            .recibo-container::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 7px;
              border: 2px solid #f1f1f1;
            }
            
            .recibo-container::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
            }
          }
        </style>
      </head>
      <body>
        <div class="recibo-container">
          <div class="recibo-header">
            <div class="cinema-logo">🎬 CINE DIGITAL 🎬</div>
            <div class="recibo-titulo">RECIBO DE VENTA DE BOLETOS</div>
            <div class="fecha-hora-venta">
              📅 ${this.formatearFecha(fechaVenta.toISOString())} • 🕐 ${this.formatearHora(fechaVenta.toISOString())}
            </div>
          </div>
          
          <div class="resumen-venta">
            <div class="resumen-titulo">📋 Resumen de la Compra</div>
            <div class="resumen-item">
              <span><strong>🎬 Película:</strong></span>
              <span>${this.funcionSeleccionada?.pelicula?.titulo || 'N/A'}</span>
            </div>
            <div class="resumen-item">
              <span><strong>📅 Función:</strong></span>
              <span>${this.formatearFecha(this.funcionSeleccionada?.inicio || '')} - ${this.formatearHora(this.funcionSeleccionada?.inicio || '')}</span>
            </div>
            <div class="resumen-item">
              <span><strong>🏢 Sala:</strong></span>
              <span>${this.funcionSeleccionada?.sala?.nombre || 'N/A'}</span>
            </div>
            <div class="resumen-item">
              <span><strong>🎫 Cantidad de boletos:</strong></span>
              <span>${totalBoletos}</span>
            </div>
            <div class="resumen-item">
              <span><strong>💰 Precio unitario:</strong></span>
              <span>$${precioUnitario.toFixed(2)}</span>
            </div>
            <div class="resumen-item total">
              <span><strong>💳 TOTAL PAGADO:</strong></span>
              <span>$${totalVenta.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="boletos-seccion">
            <div class="seccion-titulo">🎫 Boletos Generados (${totalBoletos})</div>
            <div class="boletos-grid">
    `;

    console.log('🔄 Generando boletos, total:', this.boletosCreados.length);
    
    // Generar cada boleto
    for (let i = 0; i < this.boletosCreados.length; i++) {
      const boleto = this.boletosCreados[i];
      console.log(`🎫 Procesando boleto ${i + 1}:`, {
        id: boleto.id,
        codigoQR: boleto.codigoQR,
        codigoQRLength: boleto.codigoQR?.length,
        codigoQRType: typeof boleto.codigoQR
      });
      
      // Validar y limpiar el código QR
      if (!boleto.codigoQR || boleto.codigoQR.trim() === '') {
        console.error(`❌ Código QR vacío para boleto ${i + 1}`);
        continue; // Saltar este boleto
      }
      
      const codigoQRLimpio = String(boleto.codigoQR).trim().replace(/[\r\n\t]/g, '');
      console.log(`🧹 Código QR limpio: "${codigoQRLimpio}"`);
      
      try {
        
        // Generar código QR como Data URL
        console.log(`📱 Generando QR para boleto ${i + 1}...`);
        let qrDataURL: string;
        
        try {
          // Intento con configuración completa (QR más pequeño para múltiples boletos)
          qrDataURL = await QRCode.toDataURL(codigoQRLimpio, {
            width: 80,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (qrFirstError) {
          console.log(`⚠️ Primer intento falló:`, qrFirstError);
          console.log(`🔄 Probando configuración básica...`);
          // Intento con configuración básica
          qrDataURL = await QRCode.toDataURL(codigoQRLimpio);
        }
        
        console.log(`✅ QR generado exitosamente para boleto ${i + 1}`);

        // Obtener información del asiento
        const asiento = boleto.asiento;
        const filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
        const numeroAsiento = asiento ? asiento.numero : 'N/A';
        
        html += `
              <div class="boleto-item">
                <div class="boleto-info">
                  <div class="boleto-numero">Boleto #${i + 1}</div>
                  
                  <div class="pelicula-titulo">${boleto.funcion?.pelicula?.titulo || 'N/A'}</div>
                  
                  <div class="funcion-detalles">
                    <div class="detalle-item">
                      <span class="detalle-label">📅 Fecha</span>
                      <span class="detalle-valor">${this.formatearFecha(boleto.funcion?.inicio || '')}</span>
                    </div>
                    <div class="detalle-item">
                      <span class="detalle-label">🕐 Hora</span>
                      <span class="detalle-valor">${this.formatearHora(boleto.funcion?.inicio || '')}</span>
                    </div>
                    <div class="detalle-item">
                      <span class="detalle-label">🏢 Sala</span>
                      <span class="detalle-valor">${boleto.funcion?.sala?.nombre || 'N/A'}</span>
                    </div>
                    <div class="detalle-item">
                      <span class="detalle-label">✅ Estado</span>
                      <span class="detalle-valor">${boleto.estado}</span>
                    </div>
                  </div>
                  
                  <div class="asiento-destacado">
                    🪑 FILA ${filaLetra} - ASIENTO ${numeroAsiento}
                  </div>
                  
                  <div class="precio-boleto">
                    💰 $${boleto.funcion?.precio || '0.00'}
                  </div>
                </div>
                
                <div class="boleto-qr-section">
                  <div class="qr-code">
                    <img src="${qrDataURL}" alt="Código QR" width="80" height="80" />
                  </div>
                  <div class="codigo-texto">
                    ${codigoQRLimpio}
                  </div>
                </div>
        `;
      } catch (qrError) {
          console.error(`❌ Error generando QR para boleto ${i + 1}:`, {
            boletoId: boleto.id,
            error: qrError,
            codigoQR: boleto.codigoQR,
            errorMessage: (qrError as Error).message,
            errorStack: (qrError as Error).stack
          });        const asiento = boleto.asiento;
        const filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
        const numeroAsiento = asiento ? asiento.numero : 'N/A';
        
        html += `
              <div class="boleto-item">
                <div class="boleto-info">
                  <div class="boleto-numero">Boleto #${i + 1}</div>
                  
                  <div class="pelicula-titulo">${boleto.funcion?.pelicula?.titulo || 'N/A'}</div>
                  
                  <div class="asiento-destacado">
                    🪑 FILA ${filaLetra} - ASIENTO ${numeroAsiento}
                  </div>
                  
                  <div style="color: red; font-weight: bold; text-align: center; padding: 20px;">
                    ❌ ERROR: No se pudo generar código QR
                  </div>
                  <div style="font-size: 10px; text-align: center; word-break: break-all;">
                    Código: ${boleto.codigoQR}
                  </div>
                </div>
                
                <div class="boleto-qr-section">
                  <div style="padding: 30px; border: 3px solid red; border-radius: 10px; color: red;">
                    <div style="font-weight: bold; margin-bottom: 10px;">❌ ERROR QR</div>
                    <div style="font-size: 10px; word-break: break-all;">
                      ${codigoQRLimpio}
                    </div>
                  </div>
                </div>
              </div>
        `;
      }
    }

    html += `
            </div>
          </div>
          
          <div class="recibo-footer">
            <div class="terminos">
              <strong>📋 Términos y Condiciones:</strong><br>
              • Conserve estos boletos durante toda la función<br>
              • Los boletos son válidos únicamente para la fecha y hora indicadas<br>
              • No se permiten cambios ni devoluciones<br>
              • Presente el código QR al momento del ingreso<br>
              • El acceso está sujeto a disponibilidad de asientos
            </div>
            
            <div class="contacto">
              🎬 CINE DIGITAL - Su experiencia cinematográfica 🎬<br>
              📞 Contacto: (555) 123-4567 | 📧 info@cinedigital.com
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('🏁 HTML generado completamente, longitud total:', html.length);
    return html;
  }

  private async generarHTMLSimpleConQR(): Promise<string> {
    console.log('🔧 Generando HTML simple con códigos QR...');
    
    const totalBoletos = this.boletosCreados.length;
    const precioUnitario = this.funcionSeleccionada?.precio || 0;
    const totalVenta = totalBoletos * precioUnitario;
    const fechaVenta = new Date();

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Boletos - Cine Digital</title>
        <style>
          @page { size: A4; margin: 1cm; }
          body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }
          .header { text-align: center; margin-bottom: 15px; }
          .boleto { 
            border: 2px solid #333; 
            margin: 10px 0; 
            padding: 10px; 
            display: flex; 
            height: 120px;
            page-break-inside: avoid;
          }
          .info { flex: 1; font-size: 9px; }
          .qr { text-align: center; width: 100px; }
          .detail { margin: 3px 0; }
          /* Permitir múltiples boletos por página */
          .boleto:nth-child(4n+1) { page-break-before: auto; }
          @media print { 
            body { font-size: 9px; }
            .boleto { height: 110px; }
            .qr img { width: 80px !important; height: 80px !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎬 CINE DIGITAL 🎬</h1>
          <h2>RECIBO DE VENTA</h2>
          <p>Fecha: ${this.formatearFecha(fechaVenta.toISOString())} - ${this.formatearHora(fechaVenta.toISOString())}</p>
          <p><strong>TOTAL: $${totalVenta.toFixed(2)}</strong></p>
        </div>
    `;

    for (let i = 0; i < this.boletosCreados.length; i++) {
      const boleto = this.boletosCreados[i];
      const asiento = boleto.asiento;
      const filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
      const numeroAsiento = asiento ? asiento.numero : 'N/A';
      const codigoQRLimpio = String(boleto.codigoQR).trim();
      
      try {
        const qrDataURL = await QRCode.toDataURL(codigoQRLimpio, {
          width: 80,
          margin: 1
        });
        
        html += `
          <div class="boleto">
            <div class="info">
              <h3>Boleto #${i + 1}</h3>
              <div class="detail"><strong>Película:</strong> ${boleto.funcion?.pelicula?.titulo || 'N/A'}</div>
              <div class="detail"><strong>Fecha:</strong> ${this.formatearFecha(boleto.funcion?.inicio || '')}</div>
              <div class="detail"><strong>Hora:</strong> ${this.formatearHora(boleto.funcion?.inicio || '')}</div>
              <div class="detail"><strong>Sala:</strong> ${boleto.funcion?.sala?.nombre || 'N/A'}</div>
              <div class="detail"><strong>Asiento:</strong> Fila ${filaLetra} - Número ${numeroAsiento}</div>
              <div class="detail"><strong>Precio:</strong> $${boleto.funcion?.precio || '0.00'}</div>
            </div>
            <div class="qr">
              <img src="${qrDataURL}" width="80" height="80" alt="QR Code" />
              <div style="font-size: 8px; margin-top: 5px; word-break: break-all;">${codigoQRLimpio}</div>
            </div>
          </div>
        `;
      } catch (qrError) {
        console.error('Error generando QR simple:', qrError);
        html += `
          <div class="boleto">
            <div class="info">
              <h3>Boleto #${i + 1}</h3>
              <div class="detail"><strong>Película:</strong> ${boleto.funcion?.pelicula?.titulo || 'N/A'}</div>
              <div class="detail"><strong>Asiento:</strong> Fila ${filaLetra} - Número ${numeroAsiento}</div>
              <div class="detail"><strong>Precio:</strong> $${boleto.funcion?.precio || '0.00'}</div>
            </div>
            <div class="qr">
              <div style="border: 2px solid red; padding: 20px; color: red;">
                ERROR QR<br>
                <small>${codigoQRLimpio}</small>
              </div>
            </div>
          </div>
        `;
      }
    }

    html += `</body></html>`;
    return html;
  }

  private generarHTMLSinQR(): string {
    console.log('🔧 Generando HTML básico sin códigos QR...');
    
    const totalBoletos = this.boletosCreados.length;
    const precioUnitario = this.funcionSeleccionada?.precio || 0;
    const totalVenta = totalBoletos * precioUnitario;
    const fechaVenta = new Date();

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Recibo de Venta - Cine Digital</title>
        <style>
          @page { size: A4; margin: 1cm; }
          body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }
          .header { text-align: center; margin-bottom: 15px; }
          .boleto { 
            border: 2px solid #333; 
            margin: 10px 0; 
            padding: 15px; 
            page-break-inside: avoid;
            height: auto;
            min-height: 120px;
          }
          .info { margin: 5px 0; font-size: 9px; }
          /* Múltiples boletos por página */
          .boleto:nth-child(4n+1) { page-break-before: auto; }
          @media print { 
            body { font-size: 9px; }
            .boleto { min-height: 110px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎬 CINE DIGITAL 🎬</h1>
          <h2>RECIBO DE VENTA</h2>
          <p>Fecha: ${this.formatearFecha(fechaVenta.toISOString())} - ${this.formatearHora(fechaVenta.toISOString())}</p>
          <p><strong>TOTAL: $${totalVenta.toFixed(2)}</strong></p>
        </div>
    `;

    this.boletosCreados.forEach((boleto, i) => {
      const asiento = boleto.asiento;
      const filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
      const numeroAsiento = asiento ? asiento.numero : 'N/A';
      
      html += `
        <div class="boleto">
          <h3>Boleto #${i + 1}</h3>
          <div class="info"><strong>Película:</strong> ${boleto.funcion?.pelicula?.titulo || 'N/A'}</div>
          <div class="info"><strong>Fecha:</strong> ${this.formatearFecha(boleto.funcion?.inicio || '')}</div>
          <div class="info"><strong>Hora:</strong> ${this.formatearHora(boleto.funcion?.inicio || '')}</div>
          <div class="info"><strong>Sala:</strong> ${boleto.funcion?.sala?.nombre || 'N/A'}</div>
          <div class="info"><strong>Asiento:</strong> Fila ${filaLetra} - Número ${numeroAsiento}</div>
          <div class="info"><strong>Precio:</strong> $${boleto.funcion?.precio || '0.00'}</div>
          <div class="info"><strong>Código:</strong> ${boleto.codigoQR}</div>
        </div>
      `;
    });

    html += `
      </body>
      </html>
    `;

    return html;
  }

  private imprimirDirectamente(htmlContent: string): void {
    // Crear un iframe oculto para impresión
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    // Escribir contenido y preparar para impresión
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      
      // Esperar a que cargue y luego imprimir
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print();
          
          // Remover el iframe después de imprimir
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
    }
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

  // Métodos adicionales para el diseño simplificado (estilo cliente)
  getFilas(): number[] {
    if (!this.salaDetalles) return [];
    return Array.from({ length: this.salaDetalles.filas }, (_, i) => i + 1);
  }

  getAsientosPorFila(fila: number): Asiento[] {
    if (!this.salaDetalles?.asientos) return [];
    return this.salaDetalles.asientos.filter(asiento => 
      asiento.fila === fila && asiento.estado !== AsientoEstado.NO_EXISTE
    );
  }

  getAsientoClass(asiento: Asiento): string {
    if (this.esAsientoDanado(asiento)) {
      return 'asiento danado';
    } else if (this.esAsientoOcupado(asiento)) {
      return 'asiento ocupado';
    } else if (this.esAsientoSeleccionado(asiento)) {
      return 'asiento seleccionado';
    } else {
      return 'asiento disponible';
    }
  }

  getAsientoTooltip(asiento: Asiento): string {
    if (this.esAsientoDanado(asiento)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Dañado`;
    } else if (this.esAsientoOcupado(asiento)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Ocupado`;
    } else if (this.esAsientoSeleccionado(asiento)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Seleccionado`;
    } else {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Disponible`;
    }
  }

  // ===== MÉTODOS PARA EL RECIBO =====

  obtenerFechaActual(): string {
    const ahora = new Date();
    return ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerHoraActual(): string {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  generarQRDataURL(codigoQR: string): string {
    // Generamos el QR sincrónicamente usando el método toDataURL
    let qrDataURL = '';
    QRCode.toDataURL(codigoQR, { width: 300 }, (err, url) => {
      if (!err) {
        qrDataURL = url;
      }
    });
    return qrDataURL;
  }

  imprimirRecibo(): void {
    window.print();
  }

  async descargarRecibo(): Promise<void> {
    if (this.boletosCreados.length === 0) return;

    try {
      const fecha = new Date();
      const timestamp = fecha.getTime();
      const numeroOrden = 'BOL-' + timestamp.toString().slice(-8);
      
      // Generar QR con el código del primer boleto (todos comparten la misma compra)
      const primerBoleto = this.boletosCreados[0];
      const qrCodeDataUrl = await QRCode.toDataURL(primerBoleto.codigoQR, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const fechaFuncion = new Date(this.funcionSeleccionada?.inicio || '');
      
      // Generar el PDF usando el servicio
      await this.ticketPdfService.generarTicketBoletos({
        numeroOrden: numeroOrden,
        fecha: fecha.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        hora: fecha.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        tarjeta: 'Efectivo',
        pelicula: {
          titulo: this.funcionSeleccionada?.pelicula?.titulo || 'N/A',
          fechaFuncion: fechaFuncion.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
          horaFuncion: fechaFuncion.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          sala: this.funcionSeleccionada?.sala?.nombre || 'N/A'
        },
        asientos: this.boletosCreados.map(boleto => ({
          fila: boleto.asiento?.fila?.toString() || '?',
          numero: boleto.asiento?.numero || 0
        })),
        total: this.totalVentaCompletada,
        qrCode: qrCodeDataUrl
      }, false); // false = descargar el PDF directamente
      
      console.log('✅ Ticket PDF generado y descargado exitosamente');
    } catch (error) {
      console.error('❌ Error al generar ticket PDF:', error);
      alert('Error al generar el ticket PDF');
    }
  }

  private generarContenidoRecibo(): string {
    const boleto = this.boletosCreados[0];
    let contenido = '='.repeat(50) + '\n';
    contenido += '               RECIBO DE VENTA\n';
    contenido += '='.repeat(50) + '\n\n';
    contenido += `Venta N°: ${boleto.id.substring(0, 8).toUpperCase()}\n`;
    contenido += `Fecha: ${this.obtenerFechaActual()}\n`;
    contenido += `Hora: ${this.obtenerHoraActual()}\n\n`;
    contenido += '-'.repeat(50) + '\n';
    contenido += 'DETALLES DE LA FUNCIÓN\n';
    contenido += '-'.repeat(50) + '\n';
    contenido += `Película: ${this.funcionSeleccionada?.pelicula?.titulo}\n`;
    contenido += `Fecha: ${this.formatearFecha(this.funcionSeleccionada?.inicio || '')}\n`;
    contenido += `Hora: ${this.formatearHora(this.funcionSeleccionada?.inicio || '')}\n`;
    contenido += `Sala: ${this.funcionSeleccionada?.sala?.nombre}\n\n`;
    contenido += '-'.repeat(50) + '\n';
    contenido += 'ASIENTOS VENDIDOS\n';
    contenido += '-'.repeat(50) + '\n';
    this.boletosCreados.forEach((b, i) => {
      contenido += `${i + 1}. Fila ${b.asiento?.fila}, Asiento ${b.asiento?.numero}\n`;
    });
    contenido += '\n';
    contenido += '-'.repeat(50) + '\n';
    contenido += 'INFORMACIÓN DE PAGO\n';
    contenido += '-'.repeat(50) + '\n';
    contenido += `Método de pago: Efectivo\n`;
    contenido += `Cantidad de boletos: ${this.boletosCreados.length}\n`;
    contenido += `Precio por boleto: ${this.formatearPrecio(this.funcionSeleccionada?.precio || 0)}\n`;
    contenido += `TOTAL COBRADO: ${this.formatearPrecio(this.totalVenta)}\n\n`;
    contenido += '-'.repeat(50) + '\n';
    contenido += `Código QR: ${boleto.codigoQR}\n`;
    contenido += '-'.repeat(50) + '\n';
    contenido += '\n¡Gracias por su compra!\n';
    contenido += 'Presente el código QR en la entrada del cine.\n';
    contenido += '='.repeat(50) + '\n';
    return contenido;
  }
}