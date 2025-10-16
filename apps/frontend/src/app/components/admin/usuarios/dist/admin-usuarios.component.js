"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminUsuariosComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var AdminUsuariosComponent = /** @class */ (function () {
    function AdminUsuariosComponent(fb, usuariosService, authService) {
        this.fb = fb;
        this.usuariosService = usuariosService;
        this.authService = authService;
        this.usuarios = [];
        this.usuariosPaginados = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        };
        this.mostrarModalUsuario = false;
        this.mostrarModalDetalles = false;
        this.modoEdicion = false;
        this.guardando = false;
        this.loading = false;
        // Propiedades del filtro
        this.filtroBusqueda = '';
        this.filtroRol = '';
        // Control de permisos
        this.tienePermisos = false;
        this.mensajeError = '';
        // Roles disponibles
        this.rolesDisponibles = [
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'VENDEDOR', label: 'Vendedor' },
            { value: 'CLIENTE', label: 'Cliente' }
        ];
        this.usuarioForm = this.fb.group({
            nombre: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.minLength(6)]],
            rol: ['CLIENTE', forms_1.Validators.required]
        });
    }
    AdminUsuariosComponent.prototype.ngOnInit = function () {
        this.verificarPermisos();
    };
    AdminUsuariosComponent.prototype.verificarPermisos = function () {
        var usuario = this.authService.getCurrentUser();
        if (usuario && usuario.rol === 'ADMIN') {
            this.tienePermisos = true;
            this.cargarUsuarios();
        }
        else {
            this.tienePermisos = false;
            this.mensajeError = 'No tienes permisos para acceder a la gestión de usuarios. Solo los administradores pueden ver esta sección.';
            this.loading = false;
        }
    };
    AdminUsuariosComponent.prototype.cargarUsuarios = function () {
        var _this = this;
        this.loading = true;
        var params = {
            page: this.usuariosPaginados.page,
            limit: this.usuariosPaginados.limit,
            search: this.filtroBusqueda || undefined,
            rol: this.filtroRol || undefined
        };
        this.usuariosService.getUsuarios(params).subscribe({
            next: function (response) {
                _this.usuariosPaginados = response;
                _this.usuarios = response.data;
                _this.loading = false;
            },
            error: function (error) {
                var _a;
                console.error('Error al cargar usuarios:', error);
                _this.loading = false;
                if (error.status === 403) {
                    _this.tienePermisos = false;
                    _this.mensajeError = 'No tienes permisos para acceder a la gestión de usuarios. Solo los administradores pueden ver esta sección.';
                }
                else {
                    alert('Error al cargar usuarios: ' + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message));
                }
            }
        });
    };
    AdminUsuariosComponent.prototype.aplicarFiltros = function () {
        this.usuariosPaginados.page = 1;
        this.cargarUsuarios();
    };
    AdminUsuariosComponent.prototype.limpiarFiltros = function () {
        this.filtroBusqueda = '';
        this.filtroRol = '';
        this.aplicarFiltros();
    };
    AdminUsuariosComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroBusqueda || this.filtroRol);
    };
    AdminUsuariosComponent.prototype.contarFiltrosActivos = function () {
        var count = 0;
        if (this.filtroBusqueda)
            count++;
        if (this.filtroRol)
            count++;
        return count;
    };
    AdminUsuariosComponent.prototype.abrirModalCrear = function () {
        var _a, _b;
        this.modoEdicion = false;
        this.usuarioSeleccionado = undefined;
        this.usuarioForm.reset({
            nombre: '',
            email: '',
            password: '',
            rol: 'CLIENTE'
        });
        // En modo creación, la contraseña es requerida
        (_a = this.usuarioForm.get('password')) === null || _a === void 0 ? void 0 : _a.setValidators([forms_1.Validators.required, forms_1.Validators.minLength(6)]);
        (_b = this.usuarioForm.get('password')) === null || _b === void 0 ? void 0 : _b.updateValueAndValidity();
        this.mostrarModalUsuario = true;
    };
    AdminUsuariosComponent.prototype.editarUsuario = function (usuario) {
        var _a, _b;
        this.modoEdicion = true;
        this.usuarioSeleccionado = usuario;
        this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            email: usuario.email,
            password: '',
            rol: usuario.rol
        });
        // En modo edición, la contraseña es opcional
        (_a = this.usuarioForm.get('password')) === null || _a === void 0 ? void 0 : _a.setValidators([forms_1.Validators.minLength(6)]);
        (_b = this.usuarioForm.get('password')) === null || _b === void 0 ? void 0 : _b.updateValueAndValidity();
        this.mostrarModalUsuario = true;
    };
    AdminUsuariosComponent.prototype.guardarUsuario = function () {
        var _this = this;
        if (this.usuarioForm.invalid) {
            Object.keys(this.usuarioForm.controls).forEach(function (key) {
                var _a;
                (_a = _this.usuarioForm.get(key)) === null || _a === void 0 ? void 0 : _a.markAsTouched();
            });
            return;
        }
        this.guardando = true;
        var formData = this.usuarioForm.value;
        // Si no hay contraseña en edición, no la enviamos
        if (this.modoEdicion && !formData.password) {
            delete formData.password;
        }
        var observable = this.modoEdicion
            ? this.usuariosService.updateUsuario(this.usuarioSeleccionado.id, formData)
            : this.usuariosService.createUsuario(formData);
        observable.subscribe({
            next: function () {
                _this.guardando = false;
                _this.cerrarModal();
                _this.cargarUsuarios();
                alert("Usuario " + (_this.modoEdicion ? 'actualizado' : 'creado') + " exitosamente");
            },
            error: function (error) {
                var _a;
                console.error('Error al guardar usuario:', error);
                _this.guardando = false;
                alert('Error al guardar usuario: ' + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message));
            }
        });
    };
    AdminUsuariosComponent.prototype.eliminarUsuario = function (usuario) {
        var _this = this;
        var mensaje = "\u00BFEst\u00E1s seguro de que deseas eliminar al usuario \"" + usuario.nombre + "\"?\n\nEsta acci\u00F3n no se puede deshacer.";
        if (confirm(mensaje)) {
            this.usuariosService.deleteUsuario(usuario.id).subscribe({
                next: function () {
                    _this.cargarUsuarios();
                    alert('Usuario eliminado exitosamente');
                },
                error: function (error) {
                    var _a;
                    console.error('Error al eliminar usuario:', error);
                    alert('Error al eliminar usuario: ' + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message));
                }
            });
        }
    };
    AdminUsuariosComponent.prototype.verDetalles = function (usuario) {
        this.usuarioSeleccionado = usuario;
        this.mostrarModalDetalles = true;
    };
    AdminUsuariosComponent.prototype.cerrarModal = function () {
        this.mostrarModalUsuario = false;
        this.usuarioSeleccionado = undefined;
        this.modoEdicion = false;
        this.guardando = false;
    };
    AdminUsuariosComponent.prototype.cerrarModalDetalles = function () {
        this.mostrarModalDetalles = false;
        this.usuarioSeleccionado = undefined;
    };
    AdminUsuariosComponent.prototype.cambiarPagina = function (page) {
        if (page >= 1 && page <= this.usuariosPaginados.totalPages) {
            this.usuariosPaginados.page = page;
            this.cargarUsuarios();
        }
    };
    AdminUsuariosComponent.prototype.getPaginas = function () {
        var pages = [];
        var total = this.usuariosPaginados.totalPages;
        var current = this.usuariosPaginados.page;
        if (total <= 7) {
            for (var i = 1; i <= total; i++) {
                pages.push(i);
            }
        }
        else {
            if (current <= 4) {
                for (var i = 1; i <= 5; i++)
                    pages.push(i);
                pages.push(-1); // Separador
                pages.push(total);
            }
            else if (current >= total - 3) {
                pages.push(1);
                pages.push(-1); // Separador
                for (var i = total - 4; i <= total; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push(-1); // Separador
                for (var i = current - 1; i <= current + 1; i++)
                    pages.push(i);
                pages.push(-1); // Separador
                pages.push(total);
            }
        }
        return pages;
    };
    AdminUsuariosComponent.prototype.formatearFecha = function (fecha) {
        return new Date(fecha).toLocaleDateString('es-ES');
    };
    AdminUsuariosComponent.prototype.formatearRol = function (rol) {
        var roles = {
            'ADMIN': 'Administrador',
            'VENDEDOR': 'Vendedor',
            'CLIENTE': 'Cliente'
        };
        return roles[rol] || rol;
    };
    AdminUsuariosComponent.prototype.getRolBadgeClass = function (rol) {
        var classes = {
            'ADMIN': 'bg-danger',
            'VENDEDOR': 'bg-warning text-dark',
            'CLIENTE': 'bg-primary'
        };
        return classes[rol] || 'bg-secondary';
    };
    AdminUsuariosComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-usuarios',
            standalone: true,
            imports: [common_1.CommonModule, router_1.RouterModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
            templateUrl: './admin-usuarios.component.html',
            styleUrls: ['./admin-usuarios.component.scss']
        })
    ], AdminUsuariosComponent);
    return AdminUsuariosComponent;
}());
exports.AdminUsuariosComponent = AdminUsuariosComponent;
