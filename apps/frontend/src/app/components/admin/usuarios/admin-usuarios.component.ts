import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService, Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../../../services/usuarios.service';
import { AuthService } from '../../../services/auth.service';
import { PaginatedResponse } from '../../../models/common.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosPaginados: PaginatedResponse<Usuario> = {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  };
  
  usuarioForm: FormGroup;
  usuarioSeleccionado?: Usuario;
  mostrarModalUsuario = false;
  mostrarModalDetalles = false;
  modoEdicion = false;
  guardando = false;
  loading = false;

  // Propiedades del filtro
  filtroBusqueda = '';
  filtroRol = '';
  
  // Control de permisos
  tienePermisos = false;
  mensajeError = '';
  
  // Roles disponibles
  rolesDisponibles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'VENDEDOR', label: 'Vendedor' },
    { value: 'CLIENTE', label: 'Cliente' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['CLIENTE', Validators.required]
    });
  }

  ngOnInit() {
    this.verificarPermisos();
  }

  verificarPermisos() {
    const usuario = this.authService.getCurrentUser();
    if (usuario && usuario.rol === 'ADMIN') {
      this.tienePermisos = true;
      this.cargarUsuarios();
    } else {
      this.tienePermisos = false;
      this.mensajeError = 'No tienes permisos para acceder a la gestión de usuarios. Solo los administradores pueden ver esta sección.';
      this.loading = false;
    }
  }

  cargarUsuarios() {
    this.loading = true;
    const params = {
      page: this.usuariosPaginados.page,
      limit: this.usuariosPaginados.limit,
      search: this.filtroBusqueda || undefined,
      rol: this.filtroRol || undefined
    };

    this.usuariosService.getUsuarios(params).subscribe({
      next: (response) => {
        this.usuariosPaginados = response;
        this.usuarios = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        
        if (error.status === 403) {
          this.tienePermisos = false;
          this.mensajeError = 'No tienes permisos para acceder a la gestión de usuarios. Solo los administradores pueden ver esta sección.';
        } else {
          alert('Error al cargar usuarios: ' + (error.error?.message || error.message));
        }
      }
    });
  }

  aplicarFiltros() {
    this.usuariosPaginados.page = 1;
    this.cargarUsuarios();
  }

  limpiarFiltros() {
    this.filtroBusqueda = '';
    this.filtroRol = '';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroRol);
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtroBusqueda) count++;
    if (this.filtroRol) count++;
    return count;
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.usuarioSeleccionado = undefined;
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      password: '',
      rol: 'CLIENTE'
    });
    // En modo creación, la contraseña es requerida
    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.mostrarModalUsuario = true;
  }

  editarUsuario(usuario: Usuario) {
    this.modoEdicion = true;
    this.usuarioSeleccionado = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // No mostramos la contraseña actual
      rol: usuario.rol
    });
    // En modo edición, la contraseña es opcional
    this.usuarioForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.mostrarModalUsuario = true;
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.guardando = true;
    const formData = this.usuarioForm.value;

    // Si no hay contraseña en edición, no la enviamos
    if (this.modoEdicion && !formData.password) {
      delete formData.password;
    }

    const observable = this.modoEdicion
      ? this.usuariosService.updateUsuario(this.usuarioSeleccionado!.id, formData)
      : this.usuariosService.createUsuario(formData);

    observable.subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModal();
        this.cargarUsuarios();
        alert(`Usuario ${this.modoEdicion ? 'actualizado' : 'creado'} exitosamente`);
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
        this.guardando = false;
        
        // Manejo específico para email duplicado (HTTP 409)
        if (error.status === 409) {
          alert('❌ Este correo electrónico ya está en uso. Por favor, usa otro correo.');
        } else if (error.error?.message) {
          alert('Error al guardar usuario: ' + error.error.message);
        } else {
          alert('Error al guardar usuario. Por favor, intenta de nuevo.');
        }
      }
    });
  }

  eliminarUsuario(usuario: Usuario) {
    const mensaje = `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}"?\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
      this.usuariosService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('Usuario eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  verDetalles(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalDetalles = true;
  }

  cerrarModal() {
    this.mostrarModalUsuario = false;
    this.usuarioSeleccionado = undefined;
    this.modoEdicion = false;
    this.guardando = false;
  }

  cerrarModalDetalles() {
    this.mostrarModalDetalles = false;
    this.usuarioSeleccionado = undefined;
  }

  cambiarPagina(page: number) {
    if (page >= 1 && page <= this.usuariosPaginados.totalPages) {
      this.usuariosPaginados.page = page;
      this.cargarUsuarios();
    }
  }

  getPaginas(): number[] {
    const pages: number[] = [];
    const total = this.usuariosPaginados.totalPages;
    const current = this.usuariosPaginados.page;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // Separador
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1); // Separador
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1); // Separador
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1); // Separador
        pages.push(total);
      }
    }
    
    return pages;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearRol(rol: string): string {
    const roles: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'VENDEDOR': 'Vendedor',
      'CLIENTE': 'Cliente'
    };
    return roles[rol] || rol;
  }

  getRolBadgeClass(rol: string): string {
    const classes: { [key: string]: string } = {
      'ADMIN': 'bg-danger',
      'VENDEDOR': 'bg-warning text-dark',
      'CLIENTE': 'bg-primary'
    };
    return classes[rol] || 'bg-secondary';
  }
}