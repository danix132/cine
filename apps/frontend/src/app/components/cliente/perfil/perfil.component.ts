import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

interface TarjetaGuardada {
  id: string;
  nombre: string;
  ultimos4: string;
  tipo: string;
}

interface Preferencias {
  generosFavoritos: string[];
  actoresFavoritos: string[];
  directoresFavoritos: string[];
  notificaciones: {
    email: boolean;
    promociones: boolean;
    estrenos: boolean;
  };
  idioma: string;
  privacidad: {
    perfilPublico: boolean;
    mostrarHistorial: boolean;
  };
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: User | null = null;
  editMode = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  isBrowser: boolean;
  
  // Tabs
  activeTab: 'info' | 'seguridad' | 'pagos' = 'info';

  // Formulario de edición
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    fotoPerfil: ''
  };

  // Métodos de pago
  tarjetasGuardadas: TarjetaGuardada[] = [];
  nuevaTarjeta = {
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: '',
    guardar: true
  };
  mostrarFormTarjeta = false;

  // Preferencias - solo para mantener compatibilidad
  preferencias: Preferencias = {
    generosFavoritos: [],
    actoresFavoritos: [],
    directoresFavoritos: [],
    notificaciones: {
      email: true,
      promociones: true,
      estrenos: true
    },
    idioma: 'es',
    privacidad: {
      perfilPublico: false,
      mostrarHistorial: true
    }
  };

  // Cambio de contraseña
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswordForm = false;

  // Foto de perfil
  fotoPerfilUrl = '';
  mostrarCambiarFoto = false;

  // Géneros preferidos
  generosDisponibles = [
    'Acción', 'Aventura', 'Animación', 'Comedia', 'Crimen',
    'Documental', 'Drama', 'Fantasía', 'Terror', 'Musical',
    'Misterio', 'Romance', 'Ciencia Ficción', 'Suspenso', 'Western'
  ];
  generosSeleccionados: string[] = [];
  mostrarPreferencias = false;

  // Modales
  mostrarModalBorrarCuenta = false;
  pasoConfirmacion = 1;
  textoConfirmacion = '';
  errorConfirmacion = '';
  mostrarModalMensaje = false;
  tipoMensaje: 'success' | 'error' = 'success';
  tituloMensaje = '';
  contenidoMensaje = '';

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadTarjetasGuardadas();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = this.authService.getCurrentUser();
      
      if (user) {
        this.usuario = user;
        this.formData = {
          nombre: user.nombre || '',
          email: user.email || '',
          telefono: '',
          fotoPerfil: ''
        };
        // Cargar foto de perfil desde localStorage usando el ID del usuario
        if (this.isBrowser) {
          const userKey = `fotoPerfil_${user.id}`;
          this.fotoPerfilUrl = localStorage.getItem(userKey) || '';
        }
        
        // Cargar géneros preferidos
        if (user.generosPreferidos) {
          this.generosSeleccionados = user.generosPreferidos.split(',').map(g => g.trim());
        }
      } else {
        this.errorMessage = 'No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.';
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.errorMessage = 'Error al cargar tus datos. Por favor, intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  loadTarjetasGuardadas(): void {
    if (!this.isBrowser) return;
    
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      
      const userKey = `tarjetasGuardadas_${user.id}`;
      const tarjetasStr = localStorage.getItem(userKey);
      if (tarjetasStr) {
        this.tarjetasGuardadas = JSON.parse(tarjetasStr);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas guardadas:', error);
    }
  }

  // Tabs
  changeTab(tab: 'info' | 'seguridad' | 'pagos'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Información Personal
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.successMessage = '';
    this.errorMessage = '';
    
    if (!this.editMode && this.usuario) {
      // Restaurar datos originales si se cancela
      this.formData = {
        nombre: this.usuario.nombre || '',
        email: this.usuario.email || '',
        telefono: '',
        fotoPerfil: this.fotoPerfilUrl
      };
    }
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validación básica
    if (!this.formData.nombre || !this.formData.email) {
      this.errorMessage = 'Por favor completa los campos obligatorios (Nombre, Email)';
      return;
    }

    // Guardar en localStorage con el ID del usuario
    if (this.isBrowser && this.usuario) {
      if (this.formData.fotoPerfil) {
        const userKey = `fotoPerfil_${this.usuario.id}`;
        localStorage.setItem(userKey, this.formData.fotoPerfil);
      }
    }
    
    console.log('Guardando perfil:', this.formData);
    this.successMessage = 'Perfil actualizado exitosamente';
    this.editMode = false;
    
    // Actualizar usuario local
    if (this.usuario) {
      this.usuario = { ...this.usuario, nombre: this.formData.nombre, email: this.formData.email };
    }
  }

  // Foto de perfil
  toggleCambiarFoto(): void {
    this.mostrarCambiarFoto = !this.mostrarCambiarFoto;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfilUrl = e.target.result;
        if (this.isBrowser && this.usuario) {
          const userKey = `fotoPerfil_${this.usuario.id}`;
          localStorage.setItem(userKey, this.fotoPerfilUrl);
        }
        this.successMessage = 'Foto de perfil actualizada';
        this.mostrarCambiarFoto = false;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarFoto(): void {
    this.fotoPerfilUrl = '';
    if (this.isBrowser && this.usuario) {
      const userKey = `fotoPerfil_${this.usuario.id}`;
      localStorage.removeItem(userKey);
    }
    this.successMessage = 'Foto de perfil eliminada';
    this.mostrarCambiarFoto = false;
  }

  // Métodos de pago
  toggleFormTarjeta(): void {
    this.mostrarFormTarjeta = !this.mostrarFormTarjeta;
    this.nuevaTarjeta = {
      numero: '',
      nombre: '',
      vencimiento: '',
      cvv: '',
      guardar: true
    };
  }

  detectarTipoTarjeta(numero: string): string {
    const primerDigito = numero.charAt(0);
    if (primerDigito === '4') return 'Visa';
    if (primerDigito === '5') return 'Mastercard';
    if (primerDigito === '3') return 'American Express';
    return 'Otra';
  }

  guardarNuevaTarjeta(): void {
    if (!this.isBrowser || !this.usuario) return;

    if (this.nuevaTarjeta.numero.length < 13) {
      this.errorMessage = 'Número de tarjeta inválido';
      return;
    }

    const nuevaTarjetaGuardada: TarjetaGuardada = {
      id: Date.now().toString(),
      nombre: this.nuevaTarjeta.nombre,
      ultimos4: this.nuevaTarjeta.numero.slice(-4),
      tipo: this.detectarTipoTarjeta(this.nuevaTarjeta.numero)
    };

    this.tarjetasGuardadas.push(nuevaTarjetaGuardada);
    
    try {
      const userKey = `tarjetasGuardadas_${this.usuario.id}`;
      localStorage.setItem(userKey, JSON.stringify(this.tarjetasGuardadas));
      this.successMessage = 'Tarjeta agregada exitosamente';
      this.mostrarFormTarjeta = false;
    } catch (error) {
      console.error('Error al guardar tarjeta:', error);
      this.errorMessage = 'Error al guardar la tarjeta';
    }
  }

  eliminarTarjeta(id: string): void {
    if (!this.isBrowser || !this.usuario) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      this.tarjetasGuardadas = this.tarjetasGuardadas.filter(t => t.id !== id);
      
      try {
        const userKey = `tarjetasGuardadas_${this.usuario.id}`;
        localStorage.setItem(userKey, JSON.stringify(this.tarjetasGuardadas));
        
        // Limpiar última tarjeta usada si era esta
        const ultimaTarjetaKey = `ultimaTarjetaUsada_${this.usuario.id}`;
        const ultimaTarjeta = localStorage.getItem(ultimaTarjetaKey);
        if (ultimaTarjeta === id) {
          localStorage.removeItem(ultimaTarjetaKey);
        }
        
        this.successMessage = 'Tarjeta eliminada exitosamente';
      } catch (error) {
        console.error('Error al eliminar tarjeta:', error);
        this.errorMessage = 'Error al eliminar la tarjeta';
      }
    }
  }

  // Seguridad
  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  changePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos de contraseña';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Llamar al servicio para cambiar contraseña
    this.isLoading = true;
    this.usuariosService.changeMyPassword(
      this.passwordForm.currentPassword,
      this.passwordForm.newPassword
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showPasswordForm = false;
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        // Mostrar modal de éxito
        this.mostrarMensaje('success', '✅ Contraseña Actualizada', response.message);
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.isLoading = false;
        
        let mensaje = 'Error al cambiar la contraseña. Por favor, intenta de nuevo.';
        
        if (error.status === 409) {
          mensaje = 'La contraseña actual es incorrecta.';
        } else if (error.error?.message) {
          mensaje = error.error.message;
        }

        this.mostrarMensaje('error', '❌ Error', mensaje);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Métodos para modal de borrar cuenta
  borrarCuenta(): void {
    this.mostrarModalBorrarCuenta = true;
    this.pasoConfirmacion = 1;
    this.textoConfirmacion = '';
    this.errorConfirmacion = '';
  }

  cerrarModalBorrarCuenta(): void {
    this.mostrarModalBorrarCuenta = false;
    this.pasoConfirmacion = 1;
    this.textoConfirmacion = '';
    this.errorConfirmacion = '';
  }

  siguientePasoConfirmacion(): void {
    this.pasoConfirmacion = 2;
    this.textoConfirmacion = '';
    this.errorConfirmacion = '';
  }

  confirmarEliminacionFinal(): void {
    if (this.textoConfirmacion !== 'CONFIRMAR') {
      this.errorConfirmacion = 'Debes escribir exactamente "CONFIRMAR" para continuar';
      return;
    }

    if (!this.usuario?.id) {
      this.mostrarMensaje('error', 'Error', 'No se pudo identificar el usuario');
      this.cerrarModalBorrarCuenta();
      return;
    }

    // Proceder con la eliminación
    this.isLoading = true;
    this.usuariosService.deleteMyAccount().subscribe({
      next: () => {
        // Limpiar localStorage del usuario
        if (this.isBrowser && this.usuario) {
          localStorage.removeItem(`fotoPerfil_${this.usuario.id}`);
          localStorage.removeItem(`tarjetasGuardadas_${this.usuario.id}`);
          localStorage.removeItem(`ultimaTarjetaUsada_${this.usuario.id}`);
        }

        this.isLoading = false;
        this.cerrarModalBorrarCuenta();
        
        // Mostrar mensaje de éxito
        this.mostrarMensaje(
          'success',
          '✅ Cuenta Eliminada',
          'Tu cuenta ha sido eliminada permanentemente. Gracias por haber usado nuestros servicios.'
        );

        // Cerrar sesión y redirigir después de 3 segundos
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error al borrar cuenta:', error);
        this.isLoading = false;
        this.cerrarModalBorrarCuenta();
        
        let mensaje = 'Error al borrar la cuenta. Por favor, intenta de nuevo más tarde.';
        
        if (error.status === 403) {
          mensaje = 'No tienes permiso para realizar esta acción.';
        } else if (error.status === 404) {
          mensaje = 'No se encontró la cuenta. Es posible que ya haya sido eliminada.';
        } else if (error.error?.message) {
          mensaje = error.error.message;
        }

        this.mostrarMensaje('error', '❌ Error', mensaje);
      }
    });
  }

  // Métodos para modal de mensajes
  mostrarMensaje(tipo: 'success' | 'error', titulo: string, contenido: string): void {
    this.tipoMensaje = tipo;
    this.tituloMensaje = titulo;
    this.contenidoMensaje = contenido;
    this.mostrarModalMensaje = true;
  }

  cerrarModalMensaje(): void {
    this.mostrarModalMensaje = false;
  }

  volver(): void {
    this.router.navigate(['/cliente']);
  }

  // ===== MÉTODOS PARA GÉNEROS PREFERIDOS =====
  
  toggleGenero(genero: string): void {
    const index = this.generosSeleccionados.indexOf(genero);
    if (index > -1) {
      this.generosSeleccionados.splice(index, 1);
    } else {
      this.generosSeleccionados.push(genero);
    }
  }

  isGeneroSeleccionado(genero: string): boolean {
    return this.generosSeleccionados.includes(genero);
  }

  guardarPreferencias(): void {
    if (this.generosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un género');
      return;
    }

    this.isLoading = true;
    const generosPreferidos = this.generosSeleccionados.join(',');

    this.usuariosService.updateMyPreferencias(generosPreferidos).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Preferencias guardadas:', response);
        
        // Actualizar el usuario actual
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.generosPreferidos = response.generosPreferidos;
          this.authService.updateCurrentUser(currentUser);
          this.usuario = currentUser;
        }

        this.mostrarMensaje(
          'success',
          '✅ Preferencias Actualizadas',
          'Tus géneros favoritos han sido guardados. Ahora recibirás recomendaciones personalizadas en la página principal.'
        );
        
        this.mostrarPreferencias = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al guardar preferencias:', error);
        
        let mensaje = 'Error al guardar preferencias. Por favor, intenta de nuevo.';
        if (error.error?.message) {
          mensaje = error.error.message;
        }

        this.mostrarMensaje('error', '❌ Error', mensaje);
      }
    });
  }

  cancelarPreferencias(): void {
    // Restaurar selección original
    if (this.usuario?.generosPreferidos) {
      this.generosSeleccionados = this.usuario.generosPreferidos.split(',').map(g => g.trim());
    } else {
      this.generosSeleccionados = [];
    }
    this.mostrarPreferencias = false;
  }
}
