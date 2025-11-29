import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DulceriaService } from '../../../services/dulceria.service';
import { AuthService } from '../../../services/auth.service';
import { DulceriaItem, DulceriaItemTipo, CreateDulceriaItemRequest, UpdateDulceriaItemRequest } from '../../../models/dulceria.model';

@Component({
  selector: 'app-admin-dulceria',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dulceria.component.html',
  styleUrls: ['./admin-dulceria.component.scss']
})
export class AdminDulceriaComponent implements OnInit {
  items: DulceriaItem[] = [];
  itemsFiltrados: DulceriaItem[] = [];
  todosLosItems: DulceriaItem[] = [];
  
  // Filtros
  filtroBusqueda = '';
  filtroTipo = '';
  filtroEstado = '';
  sugerenciasItems: DulceriaItem[] = [];
  mostrarSugerencias = false;
  sugerenciaSeleccionada = -1;
  
  // Formulario y modal
  itemForm: FormGroup;
  mostrarFormulario = false;
  itemSeleccionado: DulceriaItem | null = null;
  
  // Estados
  cargando = false;
  error = '';
  tienePermisos = false;
  mensajeError = '';
  
  // Enums y constantes
  DulceriaItemTipo = DulceriaItemTipo;
  tiposDisponibles = Object.values(DulceriaItemTipo);
  
  constructor(
    private fb: FormBuilder,
    private dulceriaService: DulceriaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      imagenUrl: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.verificarPermisos();
    if (this.tienePermisos) {
      this.cargarItems();
    }
  }

  verificarPermisos(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario || usuario.rol !== 'ADMIN') {
      this.tienePermisos = false;
      this.mensajeError = 'No tienes permisos para acceder a esta sección. Solo los administradores pueden gestionar la dulcería.';
    } else {
      this.tienePermisos = true;
    }
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  volverAlAdmin(): void {
    this.router.navigate(['/admin']);
  }

  cargarItems(): void {
    this.cargando = true;
    this.dulceriaService.getItems({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.todosLosItems = response.data;
        this.aplicarFiltroBusqueda();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando items:', error);
        this.error = 'Error al cargar los items de dulcería';
        this.cargando = false;
      }
    });
  }

  nuevoItem(): void {
    this.itemSeleccionado = null;
    this.itemForm.reset();
    this.itemForm.patchValue({
      activo: true,
      precio: 0,
      stock: 0,
      imagenUrl: ''
    });
    this.mostrarFormulario = true;
  }

  editarItem(item: DulceriaItem): void {
    this.itemSeleccionado = item;
    this.itemForm.patchValue({
      nombre: item.nombre,
      tipo: item.tipo,
      descripcion: item.descripcion || '',
      precio: item.precio,
      imagenUrl: item.imagenUrl || '',
      stock: item.stock,
      activo: item.activo
    });
    this.mostrarFormulario = true;
  }

  guardarItem(): void {
    if (!this.itemForm.valid) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    // Limpiar datos del formulario - solo enviar campos no vacíos
    const formData = this.itemForm.value;
    const cleanedData: any = {
      nombre: formData.nombre,
      tipo: formData.tipo,
      precio: Number(formData.precio) || 0,
      stock: Number(formData.stock) || 0
    };

    // Solo agregar campos opcionales si tienen valor
    if (formData.descripcion?.trim()) {
      cleanedData.descripcion = formData.descripcion.trim();
    }
    
    if (formData.imagenUrl?.trim()) {
      cleanedData.imagenUrl = formData.imagenUrl.trim();
    }

    // Para edición, incluir campo activo
    if (this.itemSeleccionado) {
      cleanedData.activo = formData.activo;
    }

    console.log('Datos del formulario original:', formData);
    console.log('Datos limpiados para enviar:', cleanedData);
    console.log('Usuario actual:', this.authService.getCurrentUser());
    console.log('Token disponible:', !!this.authService.getToken());
    
    if (this.itemSeleccionado) {
      // Actualizar item existente
      console.log('Actualizando item con ID:', this.itemSeleccionado.id);
      this.dulceriaService.updateItem(this.itemSeleccionado.id, cleanedData).subscribe({
        next: (response) => {
          console.log('Item actualizado exitosamente:', response);
          this.mostrarFormulario = false;
          this.cargarItems();
          this.error = '';
        },
        error: (error) => {
          console.error('Error completo actualizando item:', error);
          
          // Manejo detallado de errores
          if (error.status === 401) {
            this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
          } else if (error.status === 403) {
            this.error = 'No tienes permisos de administrador para realizar esta acción.';
          } else if (error.status === 404) {
            this.error = 'El item que intentas actualizar no existe.';
          } else if (error.status === 400) {
            const errorMsg = error.error?.message || 'Datos inválidos';
            this.error = `Error de validación: ${errorMsg}`;
          } else if (error.status === 0) {
            this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
          } else {
            this.error = `Error al actualizar el item: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        }
      });
    } else {
      // Crear nuevo item
      console.log('Creando nuevo item');
      this.dulceriaService.createItem(cleanedData).subscribe({
        next: (response) => {
          console.log('Item creado exitosamente:', response);
          this.mostrarFormulario = false;
          this.cargarItems();
          this.error = '';
        },
        error: (error) => {
          console.error('Error completo creando item:', error);
          
          // Manejo detallado de errores
          if (error.status === 401) {
            this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
          } else if (error.status === 403) {
            this.error = 'No tienes permisos de administrador para realizar esta acción.';
          } else if (error.status === 400) {
            const errorMsg = error.error?.message || 'Datos inválidos';
            this.error = `Error de validación: ${errorMsg}`;
          } else if (error.status === 0) {
            this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
          } else {
            this.error = `Error al crear el item: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        }
      });
    }
  }

  eliminarItem(id: string): void {
    if (confirm('¿Estás seguro de que quieres desactivar este item?')) {
      console.log('Eliminando item con ID:', id);
      console.log('Usuario actual:', this.authService.getCurrentUser());
      console.log('Token disponible:', !!this.authService.getToken());
      
      this.dulceriaService.deleteItem(id).subscribe({
        next: (response) => {
          console.log('Item eliminado exitosamente:', response);
          this.cargarItems();
          this.error = '';
        },
        error: (error) => {
          console.error('Error completo eliminando item:', error);
          
          // Manejo detallado de errores
          if (error.status === 401) {
            this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
          } else if (error.status === 403) {
            this.error = 'No tienes permisos de administrador para realizar esta acción.';
          } else if (error.status === 404) {
            this.error = 'El item que intentas eliminar no existe.';
          } else if (error.status === 0) {
            this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
          } else {
            this.error = `Error al eliminar el item: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        }
      });
    }
  }

  // Métodos de filtrado
  onBusquedaInput(event: any): void {
    this.filtroBusqueda = event.target.value;
    this.actualizarSugerencias();
    this.aplicarFiltroBusqueda();
  }

  actualizarSugerencias(): void {
    if (this.filtroBusqueda.length >= 2) {
      this.sugerenciasItems = this.todosLosItems.filter(item =>
        item.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase()))
      ).slice(0, 5);
    } else {
      this.sugerenciasItems = [];
    }
  }

  seleccionarSugerencia(item: DulceriaItem): void {
    this.filtroBusqueda = item.nombre;
    this.mostrarSugerencias = false;
    this.aplicarFiltroBusqueda();
  }

  ocultarSugerencias(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 200);
  }

  aplicarFiltroBusqueda(): void {
    let itemsFiltrados = [...this.todosLosItems];

    // Filtro por búsqueda
    if (this.filtroBusqueda) {
      itemsFiltrados = itemsFiltrados.filter(item =>
        item.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase()))
      );
    }

    // Filtro por tipo
    if (this.filtroTipo) {
      itemsFiltrados = itemsFiltrados.filter(item => item.tipo === this.filtroTipo);
    }

    // Filtro por estado
    if (this.filtroEstado) {
      const esActivo = this.filtroEstado === 'ACTIVO';
      itemsFiltrados = itemsFiltrados.filter(item => item.activo === esActivo);
    }

    this.itemsFiltrados = itemsFiltrados;
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.aplicarFiltroBusqueda();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroTipo || this.filtroEstado);
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtroBusqueda) count++;
    if (this.filtroTipo) count++;
    if (this.filtroEstado) count++;
    return count;
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(precio);
  }

  getTipoLabel(tipo: DulceriaItemTipo): string {
    switch (tipo) {
      case DulceriaItemTipo.COMBO:
        return 'Combo';
      case DulceriaItemTipo.DULCE:
        return 'Dulce';
      default:
        return tipo;
    }
  }

  getTipoIcon(tipo: DulceriaItemTipo): string {
    switch (tipo) {
      case DulceriaItemTipo.COMBO:
        return 'fas fa-box';
      case DulceriaItemTipo.DULCE:
        return 'fas fa-candy-cane';
      default:
        return 'fas fa-shopping-bag';
    }
  }

  onImagenError(event: any): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/default-dulceria.svg';
    }
  }
}