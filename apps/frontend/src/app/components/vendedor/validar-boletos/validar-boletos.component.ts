import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import jsQR from 'jsqr';

interface BoletoValidacion {
  id: string;
  codigoQR: string;
  estado: 'RESERVADO' | 'PAGADO' | 'VALIDADO' | 'CANCELADO';
  fechaValidacion?: Date | string | null; // Nueva propiedad
  funcion: {
    id: string;
    inicio: Date;
    pelicula: {
      titulo: string;
      posterUrl: string;
    };
    sala: {
      nombre: string;
    };
  };
  asiento: {
    fila: number;
    numero: number;
  };
  usuario?: {
    nombre: string;
    email: string;
  };
}

@Component({
  selector: 'app-validar-boletos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './validar-boletos.component.html',
  styleUrls: ['./validar-boletos.component.scss']
})
export class ValidarBoletosComponent implements OnInit, OnDestroy {
  camaraActiva = false;
  stream: MediaStream | null = null;
  ultimoEscaneo = '';
  procesando = false;
  
  // Estados de validación
  boleto: BoletoValidacion | null = null;
  boletos: BoletoValidacion[] = []; // Array para múltiples boletos
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';
  mostrarResultado = false;

  // Historial de escaneos
  historial: Array<{
    codigoQR: string;
    timestamp: Date;
    estado: string;
    resultado: 'valido' | 'invalido' | 'usado';
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
      // Solicitar permisos de cámara
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Usar cámara trasera en móviles
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
    // Usar canvas para capturar frames del video y detectar QR
    const video = document.getElementById('qr-video') as HTMLVideoElement;
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const escanear = () => {
      // No escanear si está procesando o mostrando resultado
      if (!this.camaraActiva || this.procesando || this.mostrarResultado) {
        if (this.camaraActiva) {
          requestAnimationFrame(escanear);
        }
        return;
      }

      // Configurar el tamaño del canvas según el video
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Capturar frame del video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Obtener los datos de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Intentar detectar código QR con jsQR
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

  // Método alternativo: escaneo manual
  escanearManual(codigoQR: string): void {
    if (!codigoQR || codigoQR.trim() === '') {
      return;
    }
    
    if (codigoQR === this.ultimoEscaneo) {
      return; // Evitar escaneos duplicados
    }

    this.ultimoEscaneo = codigoQR;
    this.validarBoleto(codigoQR);
  }

  validarBoleto(codigoQR: string): void {
    if (this.procesando) return;

    this.procesando = true;
    this.mostrarResultado = false;
    this.mensaje = 'Validando boleto...';
    this.tipoMensaje = 'info';

    const token = this.authService.getToken();
    if (!token) {
      this.procesando = false;
      this.mensaje = 'No estás autenticado';
      this.tipoMensaje = 'error';
      this.mostrarResultado = true;
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get<BoletoValidacion | BoletoValidacion[]>(
      `${environment.apiUrl}/boletos/validar/${codigoQR}`,
      { headers }
    ).subscribe({
      next: (respuesta) => {
        console.log('📥 Respuesta del backend:', respuesta);
        console.log('📊 Es array?', Array.isArray(respuesta));
        
        // El backend ahora devuelve un array de boletos
        const boletosValidados = Array.isArray(respuesta) ? respuesta : [respuesta];
        
        console.log('🎫 Boletos procesados:', boletosValidados);
        
        // Guardar TODOS los boletos
        this.boletos = boletosValidados;
        this.boleto = boletosValidados[0]; // Guardar el primero para compatibilidad
        
        const cantidadBoletos = boletosValidados.length;
        const estadoPrincipal = boletosValidados[0].estado;
        
        console.log(`📊 Cantidad de boletos: ${cantidadBoletos}`);
        console.log(`📊 Estado principal: ${estadoPrincipal}`);
        
        if (estadoPrincipal === 'PAGADO' || estadoPrincipal === 'VALIDADO') {
          if (cantidadBoletos > 1) {
            this.mensaje = `✓ ${cantidadBoletos} Boletos válidos - Pueden ingresar`;
          } else {
            this.mensaje = '✓ Boleto válido - Puede ingresar';
          }
          this.tipoMensaje = 'success';
          this.agregarAlHistorial(codigoQR, estadoPrincipal, 'valido');
          
          // Reproducir sonido de éxito
          this.reproducirSonido('success');
        } else if (estadoPrincipal === 'CANCELADO') {
          this.mensaje = '✗ Boleto cancelado - No puede ingresar';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, estadoPrincipal, 'invalido');
          this.reproducirSonido('error');
        } else {
          this.mensaje = '⚠ Boleto no pagado - Verificar en taquilla';
          this.tipoMensaje = 'error';
          this.agregarAlHistorial(codigoQR, estadoPrincipal, 'invalido');
          this.reproducirSonido('error');
        }
        
        this.mostrarResultado = true;
        this.procesando = false;
        
        // Mostrar en consola para debugging
        console.log(`🎫 ${cantidadBoletos} boleto(s) validado(s):`, boletosValidados);
        console.log('📋 Asientos:', boletosValidados.map(b => `Fila ${b.asiento.fila}-${b.asiento.numero}`).join(', '));
        
        // NO limpiar automáticamente - esperar a que usuario presione "Escanear Nuevo"
      },
      error: (error) => {
        console.error('Error al validar boleto:', error);
        this.boleto = null;
        
        // Verificar tipo de error
        if (error.status === 404) {
          this.mensaje = '✗ Código QR no válido';
          this.agregarAlHistorial(codigoQR, 'NO_ENCONTRADO', 'invalido');
        } else if (error.status === 400) {
          // Error 400 es cuando el boleto ya fue validado o no está pagado
          const errorMsg = error.error?.message || 'Boleto no válido';
          this.mensaje = '⚠️ ' + errorMsg;
          
          // Si el mensaje contiene "ya fue validado", es un boleto usado
          if (errorMsg.toLowerCase().includes('ya fue validado')) {
            this.agregarAlHistorial(codigoQR, 'YA_VALIDADO', 'usado');
          } else {
            this.agregarAlHistorial(codigoQR, 'NO_VALIDO', 'invalido');
          }
        } else {
          this.mensaje = '✗ Error al validar el boleto';
          this.agregarAlHistorial(codigoQR, 'ERROR', 'invalido');
        }
        
        this.tipoMensaje = 'error';
        this.mostrarResultado = true;
        this.procesando = false;
        this.reproducirSonido('error');
        
        // NO limpiar automáticamente - esperar a que usuario presione "Escanear Nuevo"
      }
    });
  }

  agregarAlHistorial(codigoQR: string, estado: string, resultado: 'valido' | 'invalido' | 'usado'): void {
    this.historial.unshift({
      codigoQR,
      timestamp: new Date(),
      estado,
      resultado
    });

    // Mantener solo los últimos 10
    if (this.historial.length > 10) {
      this.historial = this.historial.slice(0, 10);
    }
  }

  limpiarResultado(): void {
    this.mostrarResultado = false;
    this.boleto = null;
    this.boletos = [];
    this.mensaje = '';
    this.ultimoEscaneo = '';
  }

  escanearNuevo(): void {
    // Limpiar resultado y permitir nuevo escaneo
    this.limpiarResultado();
  }

  reproducirSonido(tipo: 'success' | 'error'): void {
    // Crear un beep usando Web Audio API
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (tipo === 'success') {
      oscillator.frequency.value = 800; // Frecuencia alta para éxito
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else {
      oscillator.frequency.value = 200; // Frecuencia baja para error
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
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
