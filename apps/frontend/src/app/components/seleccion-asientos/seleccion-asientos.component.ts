import { Component, OnInit, Input, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalasService } from '../../services/salas.service';
import { BoletosService } from '../../services/boletos.service';
import { FuncionesService } from '../../services/funciones.service';
import { AuthService } from '../../services/auth.service';
import { TicketPdfService } from '../../services/ticket-pdf.service';
import { Asiento, Sala, AsientoEstado } from '../../models/sala.model';
import { Funcion } from '../../models/funcion.model';
import { Boleto } from '../../models/boleto.model';
import * as QRCode from 'qrcode';

interface TarjetaGuardada {
  id: string;
  nombre: string;
  ultimos4: string;
  tipo: string; // 'visa', 'mastercard', etc.
}

@Component({
  selector: 'app-seleccion-asientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seleccion-asientos.component.html',
  styleUrls: ['./seleccion-asientos.component.scss']
})
export class SeleccionAsientosComponent implements OnInit {
  @Input() funcion?: Funcion;
  
  sala: Sala | null = null;
  asientos: Asiento[] = [];
  asientosSeleccionados: string[] = [];
  asientosOcupados: string[] = [];
  asientosDanados: string[] = [];
  asientosNoExisten: string[] = [];
  isLoading = true;
  errorMessage = '';
  mostrarModalCompra = false;
  mostrarRecibo = false;
  
  // Datos de tarjeta
  tarjetasGuardadas: TarjetaGuardada[] = [];
  tarjetaSeleccionada: string = ''; // 'nueva' o el ID de la tarjeta guardada
  nuevaTarjeta = {
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: '',
    guardar: false
  };

  // Datos del recibo
  recibo = {
    numeroOrden: '',
    fecha: '',
    hora: '',
    tarjeta: '',
    asientos: [] as { fila: number, numero: number }[],
    qrCode: '',
    urlValidacion: ''
  };

  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salasService: SalasService,
    private boletosService: BoletosService,
    private funcionesService: FuncionesService,
    private authService: AuthService,
    private ticketPdfService: TicketPdfService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Cargar tarjetas guardadas del localStorage
    this.loadTarjetasGuardadas();
    
    // Si no se pasó la función como input, cargarla desde la ruta
    if (!this.funcion) {
      const funcionId = this.route.snapshot.paramMap.get('funcionId');
      if (funcionId) {
        this.loadFuncion(funcionId);
      } else {
        this.errorMessage = 'ID de función no válido';
        this.isLoading = false;
      }
    } else {
      this.loadSala();
      this.loadAsientosOcupados();
    }
  }

  loadTarjetasGuardadas(): void {
    if (!this.isBrowser) return;
    
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.tarjetaSeleccionada = 'nueva';
        return;
      }

      const userKey = `tarjetasGuardadas_${user.id}`;
      const tarjetasStr = localStorage.getItem(userKey);
      if (tarjetasStr) {
        this.tarjetasGuardadas = JSON.parse(tarjetasStr);
        
        // Intentar cargar y pre-seleccionar la última tarjeta usada
        const ultimaTarjetaKey = `ultimaTarjetaUsada_${user.id}`;
        const ultimaTarjetaUsada = localStorage.getItem(ultimaTarjetaKey);
        if (ultimaTarjetaUsada && this.tarjetasGuardadas.find(t => t.id === ultimaTarjetaUsada)) {
          this.tarjetaSeleccionada = ultimaTarjetaUsada;
        } else if (this.tarjetasGuardadas.length > 0) {
          // Si no hay última tarjeta o no existe, seleccionar la primera
          this.tarjetaSeleccionada = this.tarjetasGuardadas[0].id;
        } else {
          this.tarjetaSeleccionada = 'nueva';
        }
      } else {
        // No hay tarjetas guardadas
        this.tarjetaSeleccionada = 'nueva';
      }
    } catch (error) {
      console.error('Error al cargar tarjetas guardadas:', error);
      this.tarjetaSeleccionada = 'nueva';
    }
  }

  guardarTarjeta(): void {
    if (!this.isBrowser) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.nuevaTarjeta.guardar && this.nuevaTarjeta.numero.length >= 16) {
      const nuevaTarjetaGuardada: TarjetaGuardada = {
        id: Date.now().toString(),
        nombre: this.nuevaTarjeta.nombre,
        ultimos4: this.nuevaTarjeta.numero.slice(-4),
        tipo: this.detectarTipoTarjeta(this.nuevaTarjeta.numero)
      };
      
      this.tarjetasGuardadas.push(nuevaTarjetaGuardada);
      try {
        const userKey = `tarjetasGuardadas_${user.id}`;
        localStorage.setItem(userKey, JSON.stringify(this.tarjetasGuardadas));
        // Guardar esta nueva tarjeta como última usada
        const ultimaTarjetaKey = `ultimaTarjetaUsada_${user.id}`;
        localStorage.setItem(ultimaTarjetaKey, nuevaTarjetaGuardada.id);
        // Actualizar la selección para que la próxima vez se use esta
        this.tarjetaSeleccionada = nuevaTarjetaGuardada.id;
      } catch (error) {
        console.error('Error al guardar tarjeta:', error);
      }
    }
  }

  detectarTipoTarjeta(numero: string): string {
    const primerDigito = numero.charAt(0);
    if (primerDigito === '4') return 'visa';
    if (primerDigito === '5') return 'mastercard';
    if (primerDigito === '3') return 'amex';
    return 'visa';
  }

  eliminarTarjeta(tarjetaId: string): void {
    if (!this.isBrowser) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.tarjetasGuardadas = this.tarjetasGuardadas.filter(t => t.id !== tarjetaId);
    try {
      const userKey = `tarjetasGuardadas_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(this.tarjetasGuardadas));
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
    }
    if (this.tarjetaSeleccionada === tarjetaId) {
      this.tarjetaSeleccionada = '';
    }
  }

  formatearNumeroTarjeta(event: any): void {
    // Solo permitir números
    let valor = event.target.value.replace(/\D/g, '');
    let valorFormateado = '';
    
    for (let i = 0; i < valor.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        valorFormateado += ' ';
      }
      valorFormateado += valor[i];
    }
    
    this.nuevaTarjeta.numero = valorFormateado;
  }

  formatearNombreTitular(event: any): void {
    // Solo permitir letras y espacios
    let valor = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.nuevaTarjeta.nombre = valor.toUpperCase();
  }

  formatearVencimiento(event: any): void {
    // Solo permitir números
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    
    this.nuevaTarjeta.vencimiento = valor;
  }

  formatearCVV(event: any): void {
    // Solo permitir números, máximo 4 dígitos
    let valor = event.target.value.replace(/\D/g, '');
    this.nuevaTarjeta.cvv = valor.substring(0, 4);
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir solo números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  soloLetras(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);
    
    // Permitir letras (a-z, A-Z), espacios, y caracteres con acentos
    const regex = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    
    if (!regex.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  loadFuncion(funcionId: string): void {
    this.funcionesService.getFuncion(funcionId).subscribe({
      next: (funcion) => {
        this.funcion = funcion;
        this.loadSala();
        this.loadAsientosOcupados();
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la función';
        this.isLoading = false;
        console.error('Error loading funcion:', error);
      }
    });
  }

  loadSala(): void {
    if (this.funcion && this.funcion.salaId) {
      this.salasService.getSala(this.funcion.salaId).subscribe({
        next: (sala) => {
          this.sala = sala;
          
          // Usar los asientos reales de la sala si existen
          if (sala.asientos && sala.asientos.length > 0) {
            this.asientos = sala.asientos;
            console.log('Asientos de la sala cargados:', this.asientos.length);
            console.log('Primer asiento ID:', this.asientos[0]?.id);
            
            // Cargar asientos dañados
            this.asientosDanados = sala.asientos
              .filter(asiento => asiento.estado === AsientoEstado.DANADO)
              .map(asiento => asiento.id);
            console.log('Asientos dañados:', this.asientosDanados);
            
            // Cargar asientos que no existen
            this.asientosNoExisten = sala.asientos
              .filter(asiento => asiento.estado === AsientoEstado.NO_EXISTE)
              .map(asiento => asiento.id);
            console.log('Asientos NO_EXISTE:', this.asientosNoExisten);
          } else {
            // Si no hay asientos en la sala, generarlos (fallback)
            console.log('Generando asientos (sala sin asientos)');
            this.generateAsientos();
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar la sala';
          this.isLoading = false;
          console.error('Error loading sala:', error);
        }
      });
    }
  }

  loadAsientosOcupados(): void {
    if (this.funcion && this.funcion.id) {
      this.boletosService.getBoletosPorFuncion(this.funcion.id).subscribe({
        next: (boletos) => {
          console.log('📋 Boletos recibidos del backend:', boletos);
          console.log('📊 Total boletos:', boletos.length);
          
          const boletosActivos = boletos.filter(boleto => 
            boleto.estado === 'PAGADO' || boleto.estado === 'RESERVADO' || boleto.estado === 'VALIDADO'
          );
          
          this.asientosOcupados = boletosActivos.map(boleto => boleto.asientoId);
          
          console.log('✅ Boletos activos (PAGADO/RESERVADO/VALIDADO):', boletosActivos.length);
          console.log('🪑 Asientos ocupados (IDs):', this.asientosOcupados);
          console.log('🔍 Ejemplo de boleto:', boletos[0]);
        },
        error: (error) => {
          console.error('❌ Error loading asientos ocupados:', error);
        }
      });
    }
  }

  generateAsientos(): void {
    if (!this.sala) return;

    this.asientos = [];
    for (let fila = 1; fila <= this.sala.filas; fila++) {
      for (let numero = 1; numero <= this.sala.asientosPorFila; numero++) {
        this.asientos.push({
          id: `${fila}-${numero}`,
          salaId: this.sala.id,
          fila,
          numero,
          estado: AsientoEstado.DISPONIBLE
        });
      }
    }
  }

  toggleAsiento(asientoId: string): void {
    if (this.isAsientoOcupado(asientoId) || this.isAsientoDanado(asientoId)) return;

    const index = this.asientosSeleccionados.indexOf(asientoId);
    if (index > -1) {
      this.asientosSeleccionados.splice(index, 1);
    } else {
      this.asientosSeleccionados.push(asientoId);
    }
  }

  isAsientoSeleccionado(asientoId: string): boolean {
    return this.asientosSeleccionados.includes(asientoId);
  }

  isAsientoOcupado(asientoId: string): boolean {
    return this.asientosOcupados.includes(asientoId);
  }

  isAsientoDanado(asientoId: string): boolean {
    return this.asientosDanados.includes(asientoId);
  }

  isAsientoNoExiste(asientoId: string): boolean {
    return this.asientosNoExisten.includes(asientoId);
  }

  getAsientosPorFila(fila: number): Asiento[] {
    return this.asientos.filter(asiento => asiento.fila === fila);
  }

  getFilas(): number[] {
    if (!this.sala) return [];
    return Array.from({ length: this.sala.filas }, (_, i) => i + 1);
  }

  getTotalSeleccionado(): number {
    return this.asientosSeleccionados.length;
  }

  getPrecioTotal(): number {
    if (!this.funcion) return 0;
    return this.getTotalSeleccionado() * this.funcion.precio;
  }

  continuarCompra(): void {
    if (this.asientosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un asiento');
      return;
    }
    
    // Mostrar el modal
    this.mostrarModalCompra = true;
    this.cdr.detectChanges();
    
    // Recargar tarjetas guardadas y última usada por si cambió en otra pestaña
    this.loadTarjetasGuardadas();
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModalCompra = false;
    this.tarjetaSeleccionada = '';
    this.nuevaTarjeta = {
      numero: '',
      nombre: '',
      vencimiento: '',
      cvv: '',
      guardar: false
    };
  }

  validarFormularioTarjeta(): boolean {
    if (this.tarjetaSeleccionada === 'nueva') {
      return !!(
        this.nuevaTarjeta.numero &&
        this.nuevaTarjeta.nombre &&
        this.nuevaTarjeta.vencimiento &&
        this.nuevaTarjeta.cvv &&
        this.nuevaTarjeta.numero.replace(/\s/g, '').length >= 13
      );
    }
    return !!this.tarjetaSeleccionada;
  }

  async confirmarCompra(): Promise<void> {
    if (!this.validarFormularioTarjeta()) {
      alert('Por favor complete todos los datos de la tarjeta');
      return;
    }

    if (!this.funcion) {
      alert('Error: No se ha cargado la información de la función');
      return;
    }

    // Guardar tarjeta si se seleccionó la opción y es nueva
    const esNuevaTarjeta = this.tarjetaSeleccionada === 'nueva';
    if (esNuevaTarjeta) {
      this.guardarTarjeta();
      // Nota: guardarTarjeta() ya actualiza this.tarjetaSeleccionada y localStorage
    } else {
      // Si es una tarjeta existente, guardarla como última usada
      if (this.tarjetaSeleccionada) {
        const user = this.authService.getCurrentUser();
        if (user) {
          const ultimaTarjetaKey = `ultimaTarjetaUsada_${user.id}`;
          localStorage.setItem(ultimaTarjetaKey, this.tarjetaSeleccionada);
        }
      }
    }

    const tarjetaInfo = esNuevaTarjeta 
      ? `**** ${this.nuevaTarjeta.numero.slice(-4)}`
      : `**** ${this.tarjetasGuardadas.find(t => t.id === this.tarjetaSeleccionada)?.ultimos4}`;

    // Generar datos del recibo
    const ahora = new Date();
    const numeroOrden = 'ORD-' + Date.now().toString().slice(-8);
    
    try {
      // Obtener el usuario actual (si está logueado)
      const usuarioId = this.authService.getCurrentUser()?.id;
      
      // Crear los boletos en el backend
      console.log('🎫 Creando boletos en el backend...');
      console.log('Función:', this.funcion.id);
      console.log('Asientos:', this.asientosSeleccionados);
      
      const boletos = await this.boletosService.crearBoletosCompra({
        funcionId: this.funcion.id,
        asientoIds: this.asientosSeleccionados,
        usuarioId: usuarioId
      }).toPromise();
      
      if (!boletos || boletos.length === 0) {
        throw new Error('No se pudieron crear los boletos');
      }
      
      console.log('✅ Boletos creados exitosamente:', boletos);
      
      // Usar el código QR real del primer boleto
      const codigoQRPrincipal = boletos[0].codigoQR;
      const urlValidacion = codigoQRPrincipal;

      // Generar QR code con el código real del boleto
      let qrCode = '';
      try {
        qrCode = await QRCode.toDataURL(codigoQRPrincipal, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        console.log('📱 Código QR generado:', codigoQRPrincipal);
        console.log('🎫 Total de boletos:', boletos.length);
      } catch (error) {
        console.error('Error generando QR:', error);
        throw new Error('Error al generar el código QR');
      }

      this.recibo = {
        numeroOrden,
        fecha: ahora.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        hora: ahora.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        tarjeta: tarjetaInfo,
        asientos: this.asientosSeleccionados.map(id => this.getAsientoInfo(id)),
        qrCode,
        urlValidacion
      };

      console.log('✅ Compra confirmada:', this.recibo);
      console.log('✅ Código QR válido del boleto:', urlValidacion);
      
      // Generar el ticket PDF en base64 para guardarlo
      const fechaFuncion = new Date(this.funcion.inicio);
      const total = this.recibo.asientos.length * (this.funcion.precio || 0);
      
      console.log('📄 Iniciando generación de ticket PDF...');
      console.log('   ticketPdfService disponible:', !!this.ticketPdfService);
      console.log('   Llamando a generarTicketBoletos con soloGenerar=true');
      
      let ticketBase64: any;
      try {
        ticketBase64 = await this.ticketPdfService.generarTicketBoletos({
          numeroOrden: this.recibo.numeroOrden,
          fecha: this.recibo.fecha,
          hora: this.recibo.hora,
          tarjeta: this.recibo.tarjeta,
          pelicula: {
            titulo: this.funcion.pelicula?.titulo || 'N/A',
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
            sala: this.funcion.sala?.nombre || 'N/A'
          },
          asientos: this.recibo.asientos.map(a => ({
            fila: a.fila.toString(),
            numero: a.numero
          })),
          total: total,
          qrCode: this.recibo.qrCode
        }, true); // soloGenerar = true para obtener base64
        
        console.log('✅ generarTicketBoletos retornó');
        console.log('   Tipo de retorno:', typeof ticketBase64);
        console.log('   Es string:', typeof ticketBase64 === 'string');
        console.log('   Tamaño:', ticketBase64?.length || 'undefined');
        console.log('   Primeros 100 chars:', ticketBase64?.substring(0, 100) || 'no hay datos');
      } catch (err: any) {
        console.error('❌ Error en generarTicketBoletos:', err);
        console.error('   Mensaje:', err?.message);
        console.error('   Stack:', err?.stack);
        ticketBase64 = undefined;
      }
      
      // Guardar el ticket en cada boleto
      if (ticketBase64) {
        console.log('💾 Guardando ticket en los boletos...');
        for (const boleto of boletos) {
          try {
            console.log(`   Guardando en boleto ${boleto.id}...`);
            const resultado = await this.boletosService.updateBoleto(boleto.id, {
              ticketData: ticketBase64
            }).toPromise();
            console.log(`   ✅ Guardado exitosamente en boleto ${boleto.id}`);
            console.log(`   Respuesta del servidor:`, resultado);
          } catch (error: any) {
            console.error(`   ❌ Error guardando ticket en boleto ${boleto.id}:`, error);
            console.error(`   Detalles del error:`, {
              message: error?.message,
              status: error?.status,
              error: error?.error
            });
          }
        }
      } else {
        console.error('❌ ticketBase64 es undefined o vacío - NO se guardarán tickets');
      }
      
      // Marcar los asientos como ocupados inmediatamente
      this.asientosOcupados.push(...this.asientosSeleccionados);
      console.log('🪑 Asientos marcados como ocupados:', this.asientosSeleccionados);
      
      // Limpiar la selección de asientos
      this.asientosSeleccionados = [];
      
      // Cerrar modal de compra y mostrar recibo
      this.mostrarModalCompra = false;
      
      // Esperar un momento para que Angular procese el cierre del modal anterior
      setTimeout(() => {
        this.mostrarRecibo = true;
        this.cdr.detectChanges();
      }, 100);
      
    } catch (error) {
      console.error('❌ Error al crear los boletos:', error);
      alert('Error al procesar la compra. Por favor intente nuevamente.');
      // No cerramos el modal para que el usuario pueda reintentar
    }
  }

  cerrarRecibo(): void {
    this.mostrarRecibo = false;
    // Navegar al inicio del cliente
    this.router.navigate(['/cliente']);
  }

  imprimirRecibo(): void {
    window.print();
  }

  async descargarRecibo(): Promise<void> {
    if (!this.recibo || !this.funcion) return;

    const fechaFuncion = new Date(this.funcion.inicio);
    
    // Calcular total desde el recibo (asientos * precio)
    const total = this.recibo.asientos.length * (this.funcion.precio || 0);
    
    await this.ticketPdfService.generarTicketBoletos({
      numeroOrden: this.recibo.numeroOrden,
      fecha: this.recibo.fecha,
      hora: this.recibo.hora,
      tarjeta: this.recibo.tarjeta,
      pelicula: {
        titulo: this.funcion.pelicula?.titulo || 'N/A',
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
        sala: this.funcion.sala?.nombre || 'N/A'
      },
      asientos: this.recibo.asientos.map(a => ({
        fila: a.fila.toString(),
        numero: a.numero
      })),
      total: total,
      qrCode: this.recibo.qrCode
    });
  }

  getAsientoInfo(asientoId: string): { fila: number, numero: number } {
    const asiento = this.asientos.find(a => a.id === asientoId);
    return {
      fila: asiento?.fila || 0,
      numero: asiento?.numero || 0
    };
  }

  getFechaFuncion(): string {
    if (!this.funcion?.inicio) return '';
    const fecha = new Date(this.funcion.inicio);
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  getHoraFuncion(): string {
    if (!this.funcion?.inicio) return '';
    const fecha = new Date(this.funcion.inicio);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  volver(): void {
    this.router.navigate(['/funciones']);
  }

  getAsientoClass(asiento: Asiento): string {
    if (this.isAsientoDanado(asiento.id)) {
      return 'asiento danado';
    } else if (this.isAsientoOcupado(asiento.id)) {
      return 'asiento ocupado';
    } else if (this.isAsientoSeleccionado(asiento.id)) {
      return 'asiento seleccionado';
    } else {
      return 'asiento disponible';
    }
  }

  getAsientoTooltip(asiento: Asiento): string {
    if (this.isAsientoDanado(asiento.id)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Dañado`;
    } else if (this.isAsientoOcupado(asiento.id)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Ocupado`;
    } else if (this.isAsientoSeleccionado(asiento.id)) {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Seleccionado`;
    } else {
      return `Fila ${asiento.fila}, Asiento ${asiento.numero} - Disponible`;
    }
  }
}
