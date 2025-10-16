"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.AdminDulceriaComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var dulceria_model_1 = require("../../../models/dulceria.model");
var AdminDulceriaComponent = /** @class */ (function () {
    function AdminDulceriaComponent(fb, dulceriaService, authService, router) {
        this.fb = fb;
        this.dulceriaService = dulceriaService;
        this.authService = authService;
        this.router = router;
        this.items = [];
        this.itemsFiltrados = [];
        this.todosLosItems = [];
        // Filtros
        this.filtroBusqueda = '';
        this.filtroTipo = '';
        this.filtroEstado = '';
        this.sugerenciasItems = [];
        this.mostrarSugerencias = false;
        this.sugerenciaSeleccionada = -1;
        this.mostrarFormulario = false;
        this.itemSeleccionado = null;
        // Estados
        this.cargando = false;
        this.error = '';
        this.tienePermisos = false;
        this.mensajeError = '';
        // Enums y constantes
        this.DulceriaItemTipo = dulceria_model_1.DulceriaItemTipo;
        this.tiposDisponibles = Object.values(dulceria_model_1.DulceriaItemTipo);
        this.itemForm = this.fb.group({
            nombre: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2), forms_1.Validators.maxLength(100)]],
            tipo: ['', forms_1.Validators.required],
            descripcion: ['', [forms_1.Validators.maxLength(500)]],
            precio: [0, [forms_1.Validators.required, forms_1.Validators.min(0)]],
            imagenUrl: [''],
            activo: [true]
        });
    }
    AdminDulceriaComponent.prototype.ngOnInit = function () {
        this.verificarPermisos();
        if (this.tienePermisos) {
            this.cargarItems();
        }
    };
    AdminDulceriaComponent.prototype.verificarPermisos = function () {
        var usuario = this.authService.getCurrentUser();
        if (!usuario || usuario.rol !== 'ADMIN') {
            this.tienePermisos = false;
            this.mensajeError = 'No tienes permisos para acceder a esta sección. Solo los administradores pueden gestionar la dulcería.';
        }
        else {
            this.tienePermisos = true;
        }
    };
    AdminDulceriaComponent.prototype.volverAlInicio = function () {
        this.router.navigate(['/']);
    };
    AdminDulceriaComponent.prototype.volverAlAdmin = function () {
        this.router.navigate(['/admin']);
    };
    AdminDulceriaComponent.prototype.cargarItems = function () {
        var _this = this;
        this.cargando = true;
        this.dulceriaService.getItems({ page: 1, limit: 100 }).subscribe({
            next: function (response) {
                _this.todosLosItems = response.data;
                _this.aplicarFiltroBusqueda();
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error cargando items:', error);
                _this.error = 'Error al cargar los items de dulcería';
                _this.cargando = false;
            }
        });
    };
    AdminDulceriaComponent.prototype.nuevoItem = function () {
        this.itemSeleccionado = null;
        this.itemForm.reset();
        this.itemForm.patchValue({
            activo: true,
            precio: 0,
            imagenUrl: ''
        });
        this.mostrarFormulario = true;
    };
    AdminDulceriaComponent.prototype.editarItem = function (item) {
        this.itemSeleccionado = item;
        this.itemForm.patchValue({
            nombre: item.nombre,
            tipo: item.tipo,
            descripcion: item.descripcion || '',
            precio: item.precio,
            imagenUrl: item.imagenUrl || '',
            activo: item.activo
        });
        this.mostrarFormulario = true;
    };
    AdminDulceriaComponent.prototype.guardarItem = function () {
        var _this = this;
        var _a, _b;
        if (!this.itemForm.valid) {
            this.error = 'Por favor completa todos los campos requeridos';
            return;
        }
        // Limpiar datos del formulario - solo enviar campos no vacíos
        var formData = this.itemForm.value;
        var cleanedData = {
            nombre: formData.nombre,
            tipo: formData.tipo,
            precio: formData.precio
        };
        // Solo agregar campos opcionales si tienen valor
        if ((_a = formData.descripcion) === null || _a === void 0 ? void 0 : _a.trim()) {
            cleanedData.descripcion = formData.descripcion.trim();
        }
        if ((_b = formData.imagenUrl) === null || _b === void 0 ? void 0 : _b.trim()) {
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
                next: function (response) {
                    console.log('Item actualizado exitosamente:', response);
                    _this.mostrarFormulario = false;
                    _this.cargarItems();
                    _this.error = '';
                },
                error: function (error) {
                    var _a, _b;
                    console.error('Error completo actualizando item:', error);
                    // Manejo detallado de errores
                    if (error.status === 401) {
                        _this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
                    }
                    else if (error.status === 403) {
                        _this.error = 'No tienes permisos de administrador para realizar esta acción.';
                    }
                    else if (error.status === 404) {
                        _this.error = 'El item que intentas actualizar no existe.';
                    }
                    else if (error.status === 400) {
                        var errorMsg = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Datos inválidos';
                        _this.error = "Error de validaci\u00F3n: " + errorMsg;
                    }
                    else if (error.status === 0) {
                        _this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
                    }
                    else {
                        _this.error = "Error al actualizar el item: " + (((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || error.message || 'Error desconocido');
                    }
                }
            });
        }
        else {
            // Crear nuevo item
            console.log('Creando nuevo item');
            this.dulceriaService.createItem(cleanedData).subscribe({
                next: function (response) {
                    console.log('Item creado exitosamente:', response);
                    _this.mostrarFormulario = false;
                    _this.cargarItems();
                    _this.error = '';
                },
                error: function (error) {
                    var _a, _b;
                    console.error('Error completo creando item:', error);
                    // Manejo detallado de errores
                    if (error.status === 401) {
                        _this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
                    }
                    else if (error.status === 403) {
                        _this.error = 'No tienes permisos de administrador para realizar esta acción.';
                    }
                    else if (error.status === 400) {
                        var errorMsg = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Datos inválidos';
                        _this.error = "Error de validaci\u00F3n: " + errorMsg;
                    }
                    else if (error.status === 0) {
                        _this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
                    }
                    else {
                        _this.error = "Error al crear el item: " + (((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || error.message || 'Error desconocido');
                    }
                }
            });
        }
    };
    AdminDulceriaComponent.prototype.eliminarItem = function (id) {
        var _this = this;
        if (confirm('¿Estás seguro de que quieres desactivar este item?')) {
            console.log('Eliminando item con ID:', id);
            console.log('Usuario actual:', this.authService.getCurrentUser());
            console.log('Token disponible:', !!this.authService.getToken());
            this.dulceriaService.deleteItem(id).subscribe({
                next: function (response) {
                    console.log('Item eliminado exitosamente:', response);
                    _this.cargarItems();
                    _this.error = '';
                },
                error: function (error) {
                    var _a;
                    console.error('Error completo eliminando item:', error);
                    // Manejo detallado de errores
                    if (error.status === 401) {
                        _this.error = 'No tienes autorización. Por favor inicia sesión nuevamente.';
                    }
                    else if (error.status === 403) {
                        _this.error = 'No tienes permisos de administrador para realizar esta acción.';
                    }
                    else if (error.status === 404) {
                        _this.error = 'El item que intentas eliminar no existe.';
                    }
                    else if (error.status === 0) {
                        _this.error = 'No se puede conectar con el servidor. Verifica que esté funcionando.';
                    }
                    else {
                        _this.error = "Error al eliminar el item: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message || 'Error desconocido');
                    }
                }
            });
        }
    };
    // Métodos de filtrado
    AdminDulceriaComponent.prototype.onBusquedaInput = function (event) {
        this.filtroBusqueda = event.target.value;
        this.actualizarSugerencias();
        this.aplicarFiltroBusqueda();
    };
    AdminDulceriaComponent.prototype.actualizarSugerencias = function () {
        var _this = this;
        if (this.filtroBusqueda.length >= 2) {
            this.sugerenciasItems = this.todosLosItems.filter(function (item) {
                return item.nombre.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()) ||
                    (item.descripcion && item.descripcion.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()));
            }).slice(0, 5);
        }
        else {
            this.sugerenciasItems = [];
        }
    };
    AdminDulceriaComponent.prototype.seleccionarSugerencia = function (item) {
        this.filtroBusqueda = item.nombre;
        this.mostrarSugerencias = false;
        this.aplicarFiltroBusqueda();
    };
    AdminDulceriaComponent.prototype.ocultarSugerencias = function () {
        var _this = this;
        setTimeout(function () {
            _this.mostrarSugerencias = false;
        }, 200);
    };
    AdminDulceriaComponent.prototype.aplicarFiltroBusqueda = function () {
        var _this = this;
        var itemsFiltrados = __spreadArrays(this.todosLosItems);
        // Filtro por búsqueda
        if (this.filtroBusqueda) {
            itemsFiltrados = itemsFiltrados.filter(function (item) {
                return item.nombre.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()) ||
                    (item.descripcion && item.descripcion.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()));
            });
        }
        // Filtro por tipo
        if (this.filtroTipo) {
            itemsFiltrados = itemsFiltrados.filter(function (item) { return item.tipo === _this.filtroTipo; });
        }
        // Filtro por estado
        if (this.filtroEstado) {
            var esActivo_1 = this.filtroEstado === 'ACTIVO';
            itemsFiltrados = itemsFiltrados.filter(function (item) { return item.activo === esActivo_1; });
        }
        this.itemsFiltrados = itemsFiltrados;
    };
    AdminDulceriaComponent.prototype.limpiarFiltros = function () {
        this.filtroBusqueda = '';
        this.filtroTipo = '';
        this.filtroEstado = '';
        this.aplicarFiltroBusqueda();
    };
    AdminDulceriaComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroBusqueda || this.filtroTipo || this.filtroEstado);
    };
    AdminDulceriaComponent.prototype.contarFiltrosActivos = function () {
        var count = 0;
        if (this.filtroBusqueda)
            count++;
        if (this.filtroTipo)
            count++;
        if (this.filtroEstado)
            count++;
        return count;
    };
    AdminDulceriaComponent.prototype.formatearPrecio = function (precio) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(precio);
    };
    AdminDulceriaComponent.prototype.getTipoLabel = function (tipo) {
        switch (tipo) {
            case dulceria_model_1.DulceriaItemTipo.COMBO:
                return 'Combo';
            case dulceria_model_1.DulceriaItemTipo.DULCE:
                return 'Dulce';
            default:
                return tipo;
        }
    };
    AdminDulceriaComponent.prototype.getTipoIcon = function (tipo) {
        switch (tipo) {
            case dulceria_model_1.DulceriaItemTipo.COMBO:
                return 'fas fa-box';
            case dulceria_model_1.DulceriaItemTipo.DULCE:
                return 'fas fa-candy-cane';
            default:
                return 'fas fa-shopping-bag';
        }
    };
    AdminDulceriaComponent.prototype.onImagenError = function (event) {
        var img = event.target;
        if (img) {
            img.src = 'assets/images/default-dulceria.svg';
        }
    };
    AdminDulceriaComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-dulceria',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, router_1.RouterModule],
            templateUrl: './admin-dulceria.component.html',
            styleUrls: ['./admin-dulceria.component.scss']
        })
    ], AdminDulceriaComponent);
    return AdminDulceriaComponent;
}());
exports.AdminDulceriaComponent = AdminDulceriaComponent;
