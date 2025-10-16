import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import jsQR from 'jsqr';

interface PedidoDulceria {
  id: string;
  total: number;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';
  tipo: 'WEB' | 'MOSTRADOR';
  metodoPago: string;
  createdAt: Date;
  usuario?: {
    nombre: string;
    email: string;
  };
  items: Array<{
    id: string;
    tipo: string;
    referenciaId: string;
    descripcion?: string;
    cantidad: number;
    precio: number;
    precioUnitario: number;
    subtotal: number;
    dulceriaItem?: {
      nombre: string;
      tipo: string;
      precio: number;
    };
  }>;
}

@Component({
  selector: 'app-validar-dulceria',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './validar-dulceria.component.html',
  styleUrls: ['./validar-dulceria.component.scss']
})
export class ValidarDulceriaComponent implements OnInit, OnDestroy {
  camaraActiva = false;
  stream: MediaStream | null = null;
  ultimoEscaneo = '';
  procesando = false;
  
  // Estados de validación
  pedido: PedidoDulceria | null = null;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';
  mostrarResultado = false;

  // Historial de escaneos
  historial: Array<{
    pedidoId: string;
    timestamp: Date;
    estado: string;
    resultado: 'valido' | 'invalido' | 'entregado';
  }> = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.iniciarCamara();
  }

  ngOnDestroy(): void {
    this.detenerCamara();
  }

  async iniciarCamara(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      const video = document.getElementById('qr-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = this.stream;
        video.play();
        this.camaraActiva = true;
        this.iniciarDeteccion();
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.mensaje = 'No se pudo acceder a la cámara. Verifica los permisos.';
      this.tipoMensaje = 'error';
      this.mostrarResultado = true;
    }
  }

  detenerCamara(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.camaraActiva = false;
    }
  }

  iniciarDeteccion(): void {
    const video = document.getElementById('qr-video') as HTMLVideoElement;
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const escanear = () => {
      if (!this.camaraActiva || this.procesando || this.mostrarResultado) {
        if (this.camaraActiva) {
          requestAnimationFrame(escanear);
        }
        return;
      }

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        
        if (code && code.data) {
          console.log('🎯 QR detectado:', code.data);
          this.escanearManual(code.data);
        }
      }
      
      requestAnimationFrame(escanear);
    };

    escanear();
  }

  escanearManual(codigoQR: string): void {
    if (!codigoQR || codigoQR.trim() === '') {
      return;
    }
    
    if (codigoQR === this.ultimoEscaneo) {
      return;
    }

    this.ultimoEscaneo = codigoQR;
    this.validarPedido(codigoQR);
  }

  validarPedido(codigoQR: string): void {
    if (this.procesando) return;

    this.procesando = true;
    this.mostrarResultado = false;
    this.mensaje = 'Validando pedido...';
    this.tipoMensaje = 'info';

    const token = this.authService.getToken();
    if (!token) {
      this.procesando = false;
      this.mensaje = 'No estás autenticado';
      this.tipoMensaje = 'error';
      this.mostrarResultado = true;
      return;
    }

    // Extraer el ID del pedido del código QR
    // Formato esperado: "DULC-{pedidoId}" o directamente el pedidoId
    let pedidoId = codigoQR;
    if (codigoQR.startsWith('DULC-')) {
      pedidoId = codigoQR.replace('DULC-', '');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get<PedidoDulceria>(
      `${environment.apiUrl}/pedidos/${pedidoId}`,
      { headers }
    ).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        
        // Verificar si tiene items de dulcería
        const itemsDulceria = pedido.items.filter(item => item.tipo === 'DULCERIA');
        const tieneDulceria = itemsDulceria.length > 0;
        
        if (!pedido.items || pedido.items.length === 0) {
          this.mensaje = '⚠️ Este pedido no contiene items';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, 'SIN_ITEMS', 'invalido');
          this.reproducirSonido('error');
        } else if (!tieneDulceria) {
          this.mensaje = '⚠️ Este pedido no contiene productos de dulcería (solo boletos)';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, 'NO_DULCERIA', 'invalido');
          this.reproducirSonido('error');
        } else if (pedido.tipo !== 'WEB') {
          this.mensaje = '⚠️ Este pedido no es de compra web';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, 'NO_WEB', 'invalido');
          this.reproducirSonido('error');
        } else if (pedido.estado === 'CANCELADO') {
          this.mensaje = '✗ Pedido cancelado';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, 'CANCELADO', 'invalido');
          this.reproducirSonido('error');
        } else if (pedido.estado === 'COMPLETADO') {
          this.mensaje = '✓ Pedido válido - Puede entregar';
          this.tipoMensaje = 'success';
          this.agregarAlHistorial(codigoQR, 'COMPLETADO', 'valido');
          this.reproducirSonido('success');
        } else {
          this.mensaje = '⚠️ Pedido pendiente de pago';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, 'PENDIENTE', 'invalido');
          this.reproducirSonido('error');
        }
        
        this.mostrarResultado = true;
        this.procesando = false;
      },
      error: (error) => {
        console.error('Error al validar pedido:', error);
        this.pedido = null;
        
        if (error.status === 404) {
          this.mensaje = '✗ Pedido no encontrado';
          this.agregarAlHistorial(codigoQR, 'NO_ENCONTRADO', 'invalido');
        } else if (error.status === 403) {
          this.mensaje = '⚠️ No tienes permisos para ver este pedido';
          this.agregarAlHistorial(codigoQR, 'SIN_PERMISOS', 'invalido');
        } else {
          this.mensaje = '✗ Error al validar el pedido';
          this.agregarAlHistorial(codigoQR, 'ERROR', 'invalido');
        }
        
        this.tipoMensaje = 'error';
        this.mostrarResultado = true;
        this.procesando = false;
        this.reproducirSonido('error');
      }
    });
  }

  marcarComoEntregado(): void {
    if (!this.pedido) return;

    const token = this.authService.getToken();
    if (!token) return;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Aquí podrías agregar un endpoint para marcar como entregado
    // Por ahora solo actualizamos la UI
    this.mensaje = '✓ Pedido marcado como entregado';
    this.tipoMensaje = 'success';
    this.agregarAlHistorial(this.pedido.id, 'ENTREGADO', 'entregado');
    this.reproducirSonido('success');
    
    setTimeout(() => {
      this.escanearNuevo();
    }, 2000);
  }

  agregarAlHistorial(pedidoId: string, estado: string, resultado: 'valido' | 'invalido' | 'entregado'): void {
    this.historial.unshift({
      pedidoId,
      timestamp: new Date(),
      estado,
      resultado
    });

    if (this.historial.length > 10) {
      this.historial = this.historial.slice(0, 10);
    }
  }

  limpiarResultado(): void {
    this.mostrarResultado = false;
    this.pedido = null;
    this.mensaje = '';
    this.ultimoEscaneo = '';
  }

  escanearNuevo(): void {
    this.limpiarResultado();
  }

  reproducirSonido(tipo: 'success' | 'error'): void {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (tipo === 'success') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else {
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }

  getTotalItems(): number {
    return this.pedido?.items?.length || 0;
  }

  getItemNombre(item: any): string {
    if (item.dulceriaItem?.nombre) {
      return item.dulceriaItem.nombre;
    }
    if (item.referenciaId) {
      return `Producto #${item.referenciaId.substring(0, 8)}`;
    }
    return 'Producto sin nombre';
  }

  trackByItemId(index: number, item: any): any {
    return item.id || index;
  }

  getTotal(): number {
    if (!this.pedido?.total) return 0;
    // Convertir Decimal de Prisma a number
    return Number(this.pedido.total);
  }

  getPrecio(item: any): number {
    return Number(item.precio || 0);
  }

  getSubtotal(item: any): number {
    return Number(item.subtotal || 0);
  }

  volver(): void {
    this.detenerCamara();
    this.router.navigate(['/vendedor']);
  }

  toggleCamara(): void {
    if (this.camaraActiva) {
      this.detenerCamara();
    } else {
      this.iniciarCamara();
    }
  }
}
