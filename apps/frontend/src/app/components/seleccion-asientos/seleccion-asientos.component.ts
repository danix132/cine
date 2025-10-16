import { Component, OnInit, Input, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalasService } from '../../services/salas.service';
import { BoletosService } from '../../services/boletos.service';
import { FuncionesService } from '../../services/funciones.service';
import { AuthService } from '../../services/auth.service';
import { Asiento, Sala, AsientoEstado } from '../../models/sala.model';
import { Funcion } from '../../models/funcion.model';
import { Boleto } from '../../models/boleto.model';
import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

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
      const tarjetasStr = localStorage.getItem('tarjetasGuardadas');
      if (tarjetasStr) {
        this.tarjetasGuardadas = JSON.parse(tarjetasStr);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas guardadas:', error);
    }
  }

  guardarTarjeta(): void {
    if (!this.isBrowser) return;
    
    if (this.nuevaTarjeta.guardar && this.nuevaTarjeta.numero.length >= 16) {
      const nuevaTarjetaGuardada: TarjetaGuardada = {
        id: Date.now().toString(),
        nombre: this.nuevaTarjeta.nombre,
        ultimos4: this.nuevaTarjeta.numero.slice(-4),
        tipo: this.detectarTipoTarjeta(this.nuevaTarjeta.numero)
      };
      
      this.tarjetasGuardadas.push(nuevaTarjetaGuardada);
      try {
        localStorage.setItem('tarjetasGuardadas', JSON.stringify(this.tarjetasGuardadas));
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
    
    this.tarjetasGuardadas = this.tarjetasGuardadas.filter(t => t.id !== tarjetaId);
    try {
      localStorage.setItem('tarjetasGuardadas', JSON.stringify(this.tarjetasGuardadas));
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
    
    // Forzar detección de cambios antes de abrir el modal
    this.mostrarModalCompra = true;
    this.cdr.detectChanges();
    
    // Si no hay tarjeta seleccionada y hay tarjetas guardadas, pre-seleccionar la primera
    if (!this.tarjetaSeleccionada && this.tarjetasGuardadas.length > 0) {
      this.tarjetaSeleccionada = this.tarjetasGuardadas[0].id;
    } else if (this.tarjetasGuardadas.length === 0) {
      this.tarjetaSeleccionada = 'nueva';
    }
    
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

    // Guardar tarjeta si se seleccionó la opción
    if (this.tarjetaSeleccionada === 'nueva') {
      this.guardarTarjeta();
    }

    const tarjetaInfo = this.tarjetaSeleccionada === 'nueva' 
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

  descargarRecibo(): void {
    console.log('📄 Descargando recibo PDF...');
    console.log('🔍 Recibo actual:', {
      numeroOrden: this.recibo.numeroOrden,
      tieneQR: !!this.recibo.qrCode,
      longitudQR: this.recibo.qrCode?.length || 0
    });
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Configurar fuente
    doc.setFont('helvetica');

    // ====== ENCABEZADO ======
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234); // Color morado
    doc.text('RECIBO DE COMPRA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('www.cineapp.com', pageWidth / 2, yPosition, { align: 'center' });
    
    // Línea separadora
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // ====== INFORMACIÓN DE LA ORDEN ======
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE LA ORDEN', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Orden: ${this.recibo.numeroOrden}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fecha: ${this.recibo.fecha}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Hora: ${this.recibo.hora}`, 20, yPosition);

    // ====== INFORMACIÓN DE LA PELÍCULA ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('PELÍCULA', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(this.funcion?.pelicula?.titulo || 'N/A', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha función: ${new Date(this.funcion?.inicio || '').toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Hora: ${new Date(this.funcion?.inicio || '').toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Sala: ${this.funcion?.sala?.nombre}`, 20, yPosition);

    // ====== ASIENTOS ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('ASIENTOS SELECCIONADOS', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    this.recibo.asientos.forEach((asiento, index) => {
      doc.text(`• Fila ${asiento.fila}, Asiento ${asiento.numero}`, 25, yPosition);
      yPosition += 6;
    });

    // ====== INFORMACIÓN DE PAGO ======
    yPosition += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('INFORMACIÓN DE PAGO', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tarjeta: ${this.recibo.tarjeta}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Cantidad de boletos: ${this.recibo.asientos.length}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Precio unitario: $${this.funcion?.precio}`, 20, yPosition);
    
    // Total con fondo de color
    yPosition += 10;
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`TOTAL: $${this.getPrecioTotal()}`, pageWidth / 2, yPosition, { align: 'center' });

    // ====== CÓDIGO QR ======
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('CÓDIGO QR DE VALIDACIÓN', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Presente este código QR en la entrada del cine', 20, yPosition);
    
    // Agregar imagen del QR (ya está en base64 en this.recibo.qrCode)
    if (this.recibo.qrCode) {
      console.log('✅ Agregando QR al PDF...');
      yPosition += 5;
      const qrSize = 50;
      const qrX = (pageWidth - qrSize) / 2;
      try {
        doc.addImage(this.recibo.qrCode, 'PNG', qrX, yPosition, qrSize, qrSize);
        console.log('✅ QR agregado exitosamente en posición:', { x: qrX, y: yPosition, size: qrSize });
        yPosition += qrSize + 5;
      } catch (error) {
        console.error('❌ Error al agregar QR al PDF:', error);
      }
    } else {
      console.warn('⚠️ No hay código QR para agregar al PDF');
    }

    // ====== FOOTER ======
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('¡Gracias por su compra!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Disfrute de la función', pageWidth / 2, yPosition, { align: 'center' });

    // Línea decorativa final
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Guardar el PDF
    doc.save(`recibo-${this.recibo.numeroOrden}.pdf`);
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
