"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AdminSalasComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var AdminSalasComponent = /** @class */ (function () {
    function AdminSalasComponent(salasService, formBuilder) {
        this.salasService = salasService;
        this.formBuilder = formBuilder;
        this.salas = [];
        this.salasFiltradas = [];
        this.salaSeleccionada = null;
        this.loading = false;
        this.guardando = false;
        this.modoEdicion = false;
        this.capacidadTotal = 0;
        // Control de modales
        this.mostrarModalSala = false;
        this.mostrarModalDetalles = false;
        this.mostrarModalAsientos = false;
        // Gestión de asientos dañados
        this.salaParaAsientos = null;
        this.asientosParaGestion = [];
        this.asientosDanadosSeleccionados = new Set();
        this.guardandoAsientos = false;
        // Filtros
        this.filtroBusqueda = '';
        this.filtroCapacidad = '';
        this.filtroEstado = '';
        this.filtroCapacidadMin = 0;
        this.salaForm = this.formBuilder.group({
            nombre: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
            filas: ['', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(20)]],
            asientosPorFila: ['', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(30)]]
        });
    }
    AdminSalasComponent.prototype.ngOnInit = function () {
        this.cargarSalas();
    };
    AdminSalasComponent.prototype.cargarSalas = function () {
        var _this = this;
        this.loading = true;
        this.salasService.getSalas().subscribe({
            next: function (response) {
                _this.salas = (response.data || []).map(function (sala) {
                    var _a;
                    return (__assign(__assign({}, sala), { 
                        // Calcular asientos dañados desde el array de asientos
                        asientosDanados: ((_a = sala.asientos) === null || _a === void 0 ? void 0 : _a.filter(function (asiento) { return asiento.estado === 'DANADO'; }).length) || 0 }));
                });
                _this.aplicarFiltros();
                _this.loading = false;
            },
            error: function (error) {
                console.error('Error al cargar salas:', error);
                _this.loading = false;
            }
        });
    };
    AdminSalasComponent.prototype.aplicarFiltros = function () {
        var _this = this;
        var resultado = __spreadArrays(this.salas);
        // Filtro de búsqueda
        if (this.filtroBusqueda.trim()) {
            var termino_1 = this.filtroBusqueda.toLowerCase().trim();
            resultado = resultado.filter(function (sala) {
                return sala.nombre.toLowerCase().includes(termino_1);
            });
        }
        // Filtro de capacidad
        if (this.filtroCapacidad) {
            resultado = resultado.filter(function (sala) {
                var capacidad = sala.filas * sala.asientosPorFila;
                switch (_this.filtroCapacidad) {
                    case 'pequena':
                        return capacidad <= 50;
                    case 'mediana':
                        return capacidad > 50 && capacidad <= 100;
                    case 'grande':
                        return capacidad > 100;
                    default:
                        return true;
                }
            });
        }
        // Filtro de estado (simulado)
        if (this.filtroEstado) {
            // Por ahora todas las salas están activas, 
            // en el futuro se puede agregar un campo de estado
            if (this.filtroEstado === 'mantenimiento') {
                resultado = resultado.filter(function () { return false; }); // No hay salas en mantenimiento
            }
        }
        // Filtro de capacidad mínima (mantener compatibilidad)
        if (this.filtroCapacidadMin > 0) {
            resultado = resultado.filter(function (sala) {
                return (sala.filas * sala.asientosPorFila) >= _this.filtroCapacidadMin;
            });
        }
        this.salasFiltradas = resultado;
    };
    AdminSalasComponent.prototype.limpiarFiltros = function () {
        this.filtroBusqueda = '';
        this.filtroCapacidad = '';
        this.filtroEstado = '';
        this.filtroCapacidadMin = 0;
        this.aplicarFiltros();
    };
    AdminSalasComponent.prototype.hayFiltrosActivos = function () {
        return this.filtroBusqueda.trim() !== '' ||
            this.filtroCapacidad !== '' ||
            this.filtroEstado !== '' ||
            this.filtroCapacidadMin > 0;
    };
    AdminSalasComponent.prototype.contarFiltrosActivos = function () {
        var count = 0;
        if (this.filtroBusqueda.trim())
            count++;
        if (this.filtroCapacidad)
            count++;
        if (this.filtroEstado)
            count++;
        if (this.filtroCapacidadMin > 0)
            count++;
        return count;
    };
    AdminSalasComponent.prototype.abrirModalCrear = function () {
        this.modoEdicion = false;
        this.salaSeleccionada = null;
        this.salaForm.reset();
        this.capacidadTotal = 0;
        this.mostrarModalSala = true;
    };
    AdminSalasComponent.prototype.editarSala = function (sala) {
        console.log('🔧 Editando sala:', sala);
        this.modoEdicion = true;
        this.salaSeleccionada = sala;
        var patchData = {
            nombre: sala.nombre,
            filas: sala.filas,
            asientosPorFila: sala.asientosPorFila
        };
        console.log('🔧 Datos para patchValue:', patchData);
        this.salaForm.patchValue(patchData);
        console.log('🔧 Valores del formulario después del patch:', this.salaForm.value);
        console.log('🔧 Estado del formulario:', {
            valid: this.salaForm.valid,
            pristine: this.salaForm.pristine,
            dirty: this.salaForm.dirty
        });
        this.calcularCapacidad();
        this.mostrarModalSala = true;
    };
    AdminSalasComponent.prototype.verDetalles = function (sala) {
        console.log('📋 Viendo detalles de sala:', sala.nombre);
        // Cargar los detalles completos de la sala incluyendo asientos
        this.cargarDetallesSala(sala.id);
        this.mostrarModalDetalles = true;
    };
    AdminSalasComponent.prototype.gestionarAsientos = function (sala) {
        console.log('Gestionando asientos de:', sala.nombre);
        this.salaParaAsientos = sala;
        this.cargarAsientosParaGestion();
        this.mostrarModalAsientos = true;
    };
    AdminSalasComponent.prototype.eliminarSala = function (sala) {
        var _this = this;
        if (confirm("\u00BFEst\u00E1s seguro de que deseas eliminar la sala \"" + sala.nombre + "\"?")) {
            this.salasService.deleteSala(sala.id).subscribe({
                next: function () {
                    _this.cargarSalas();
                    console.log('Sala eliminada exitosamente');
                },
                error: function (error) {
                    console.error('Error al eliminar sala:', error);
                    alert('Error al eliminar la sala. Puede que tenga funciones asociadas.');
                }
            });
        }
    };
    AdminSalasComponent.prototype.guardarSala = function () {
        var _this = this;
        if (this.salaForm.valid) {
            this.guardando = true;
            var salaData = __assign(__assign({}, this.salaForm.value), { filas: Number(this.salaForm.value.filas), asientosPorFila: Number(this.salaForm.value.asientosPorFila) });
            console.log('📝 Guardando sala:', {
                modoEdicion: this.modoEdicion,
                salaSeleccionada: this.salaSeleccionada,
                salaData: salaData,
                formValid: this.salaForm.valid,
                formValue: this.salaForm.value,
                salaDataTipos: {
                    nombre: typeof salaData.nombre,
                    filas: typeof salaData.filas,
                    asientosPorFila: typeof salaData.asientosPorFila
                }
            });
            if (this.modoEdicion && this.salaSeleccionada) {
                console.log('🔄 Actualizando sala con ID:', this.salaSeleccionada.id);
                this.salasService.updateSala(this.salaSeleccionada.id, salaData).subscribe({
                    next: function (response) {
                        console.log('✅ Sala actualizada exitosamente:', response);
                        _this.cargarSalas();
                        _this.cerrarModal();
                        _this.guardando = false;
                    },
                    error: function (error) {
                        console.error('❌ Error al actualizar sala:', error);
                        console.error('❌ Error status:', error.status);
                        console.error('❌ Error message:', error.message);
                        console.error('❌ Error details:', error.error);
                        _this.guardando = false;
                    }
                });
            }
            else {
                this.salasService.createSala(salaData).subscribe({
                    next: function () {
                        _this.cargarSalas();
                        _this.cerrarModal();
                        _this.guardando = false;
                        console.log('Sala creada exitosamente');
                    },
                    error: function (error) {
                        console.error('Error al crear sala:', error);
                        _this.guardando = false;
                    }
                });
            }
        }
    };
    AdminSalasComponent.prototype.calcularCapacidad = function () {
        var _a, _b;
        var filas = ((_a = this.salaForm.get('filas')) === null || _a === void 0 ? void 0 : _a.value) || 0;
        var asientosPorFila = ((_b = this.salaForm.get('asientosPorFila')) === null || _b === void 0 ? void 0 : _b.value) || 0;
        this.capacidadTotal = filas * asientosPorFila;
        console.log('🧮 Capacidad calculada:', {
            filas: filas,
            asientosPorFila: asientosPorFila,
            capacidadTotal: this.capacidadTotal,
            tipoFilas: typeof filas,
            tipoAsientos: typeof asientosPorFila,
            formValue: this.salaForm.value,
            formValid: this.salaForm.valid
        });
    };
    AdminSalasComponent.prototype.cerrarModal = function (event) {
        if (event) {
            event.stopPropagation();
        }
        this.mostrarModalSala = false;
        this.modoEdicion = false;
        this.salaSeleccionada = null;
        this.salaForm.reset();
        this.capacidadTotal = 0;
    };
    AdminSalasComponent.prototype.cerrarModalDetalles = function (event) {
        if (event) {
            event.stopPropagation();
        }
        this.mostrarModalDetalles = false;
        this.salaSeleccionada = null;
    };
    // Método de debugging para verificar el estado del formulario
    AdminSalasComponent.prototype.debugFormulario = function () {
        var _this = this;
        console.log('🐛 DEBUG - Estado completo del formulario:');
        console.log('🐛 Valores:', this.salaForm.value);
        console.log('🐛 Válido:', this.salaForm.valid);
        console.log('🐛 Errores:', this.salaForm.errors);
        console.log('🐛 Controles individuales:');
        Object.keys(this.salaForm.controls).forEach(function (key) {
            var control = _this.salaForm.get(key);
            console.log("\uD83D\uDC1B " + key + ":", {
                value: control === null || control === void 0 ? void 0 : control.value,
                valid: control === null || control === void 0 ? void 0 : control.valid,
                errors: control === null || control === void 0 ? void 0 : control.errors,
                pristine: control === null || control === void 0 ? void 0 : control.pristine,
                touched: control === null || control === void 0 ? void 0 : control.touched
            });
        });
        console.log('🐛 Modo edición:', this.modoEdicion);
        console.log('🐛 Sala seleccionada:', this.salaSeleccionada);
    };
    // === GESTIÓN DE ASIENTOS DAÑADOS ===
    AdminSalasComponent.prototype.cargarAsientosParaGestion = function () {
        var _this = this;
        if (!this.salaParaAsientos)
            return;
        this.loading = true;
        this.salasService.getSala(this.salaParaAsientos.id).subscribe({
            next: function (sala) {
                _this.asientosParaGestion = sala.asientos || [];
                _this.asientosDanadosSeleccionados.clear();
                // Marcar asientos ya dañados
                _this.asientosParaGestion.forEach(function (asiento) {
                    if (asiento.estado === 'DANADO') {
                        _this.asientosDanadosSeleccionados.add(asiento.fila + "-" + asiento.numero);
                    }
                });
                console.log('🔧 Asientos cargados:', _this.asientosParaGestion.length);
                console.log('🔧 Asientos dañados actuales:', _this.asientosDanadosSeleccionados.size);
                _this.loading = false;
            },
            error: function (error) {
                console.error('Error al cargar asientos:', error);
                _this.loading = false;
            }
        });
    };
    AdminSalasComponent.prototype.toggleAsientoDanado = function (fila, numero) {
        var asientoId = fila + "-" + numero;
        if (this.asientosDanadosSeleccionados.has(asientoId)) {
            this.asientosDanadosSeleccionados["delete"](asientoId);
        }
        else {
            this.asientosDanadosSeleccionados.add(asientoId);
        }
        console.log('🪑 Asientos dañados seleccionados:', this.asientosDanadosSeleccionados.size);
    };
    AdminSalasComponent.prototype.esAsientoDanado = function (fila, numero) {
        return this.asientosDanadosSeleccionados.has(fila + "-" + numero);
    };
    AdminSalasComponent.prototype.guardarAsientosDanados = function () {
        var _this = this;
        if (!this.salaParaAsientos)
            return;
        this.guardandoAsientos = true;
        // Convertir Set a array de objetos con fila y numero
        var asientosDanados = Array.from(this.asientosDanadosSeleccionados).map(function (asientoId) {
            var _a = asientoId.split('-').map(Number), fila = _a[0], numero = _a[1];
            return { fila: fila, numero: numero };
        });
        console.log('💾 Guardando asientos dañados:', asientosDanados);
        this.salasService.updateAsientosDanados(this.salaParaAsientos.id, { asientosDanados: asientosDanados }).subscribe({
            next: function (response) {
                console.log('✅ Asientos dañados actualizados exitosamente:', response);
                // Si el modal de detalles está abierto para la misma sala, actualizarla
                if (_this.mostrarModalDetalles && _this.salaSeleccionada && _this.salaParaAsientos &&
                    _this.salaSeleccionada.id === _this.salaParaAsientos.id) {
                    console.log('🔄 Actualizando datos del modal de detalles');
                    _this.cargarDetallesSala(_this.salaSeleccionada.id);
                }
                _this.cerrarModalAsientos();
                _this.cargarSalas(); // Recargar lista de salas
                _this.guardandoAsientos = false;
            },
            error: function (error) {
                console.error('❌ Error al actualizar asientos dañados:', error);
                _this.guardandoAsientos = false;
            }
        });
    };
    AdminSalasComponent.prototype.cerrarModalAsientos = function () {
        this.mostrarModalAsientos = false;
        this.salaParaAsientos = null;
        this.asientosParaGestion = [];
        this.asientosDanadosSeleccionados.clear();
    };
    // Método para obtener las filas organizadas
    AdminSalasComponent.prototype.getFilasOrganizadas = function () {
        if (!this.salaParaAsientos)
            return [];
        var filas = [];
        var _loop_1 = function (fila) {
            var asientosDeFila = this_1.asientosParaGestion.filter(function (asiento) { return asiento.fila === fila; })
                .sort(function (a, b) { return a.numero - b.numero; });
            filas.push(asientosDeFila);
        };
        var this_1 = this;
        for (var fila = 1; fila <= this.salaParaAsientos.filas; fila++) {
            _loop_1(fila);
        }
        return filas;
    };
    // Método para recargar los detalles de una sala específica
    AdminSalasComponent.prototype.cargarDetallesSala = function (salaId) {
        var _this = this;
        this.salasService.getSala(salaId).subscribe({
            next: function (sala) {
                _this.salaSeleccionada = sala;
                console.log('🔄 Detalles de sala actualizados:', sala);
            },
            error: function (error) {
                console.error('❌ Error al recargar detalles de sala:', error);
            }
        });
    };
    // Utilidades para la vista previa
    AdminSalasComponent.prototype.getFilasArray = function (sala) {
        return Array.from({ length: sala.filas }, function (_, i) { return i + 1; });
    };
    AdminSalasComponent.prototype.getAsientosArray = function (sala) {
        return Array.from({ length: sala.asientosPorFila }, function (_, i) { return i + 1; });
    };
    AdminSalasComponent.prototype.getLabelFila = function (index) {
        return String.fromCharCode(65 + index); // A, B, C, etc.
    };
    // Métodos para dividir asientos en grupos con pasillo central
    AdminSalasComponent.prototype.getPrimerGrupoAsientos = function (sala) {
        var mitad = Math.floor(sala.asientosPorFila / 2);
        return Array.from({ length: mitad }, function (_, i) { return i + 1; });
    };
    AdminSalasComponent.prototype.getSegundoGrupoAsientos = function (sala) {
        var mitad = Math.floor(sala.asientosPorFila / 2);
        var restantes = sala.asientosPorFila - mitad;
        return Array.from({ length: restantes }, function (_, i) { return i + 1; });
    };
    // ✅ Método para verificar si un asiento está dañado en la previa
    AdminSalasComponent.prototype.esAsientoDanadoEnPrevia = function (sala, fila, numero) {
        if (!sala.asientos || sala.asientos.length === 0) {
            return false;
        }
        return sala.asientos.some(function (asiento) {
            return asiento.fila === fila && asiento.numero === numero && asiento.estado === 'DANADO';
        });
    };
    // Para el mapa de asientos detallado
    AdminSalasComponent.prototype.esAsientoDisponible = function (fila, asiento) {
        var _a;
        if (!((_a = this.salaSeleccionada) === null || _a === void 0 ? void 0 : _a.asientos))
            return true;
        // Buscar el asiento específico en la lista de asientos
        var asientoReal = this.salaSeleccionada.asientos.find(function (a) { return a.fila === (fila + 1) && a.numero === (asiento + 1); });
        // Si no existe el asiento o está dañado, retorna false
        return asientoReal ? asientoReal.estado === 'DISPONIBLE' : true;
    };
    AdminSalasComponent.prototype.calcularAsientosDisponibles = function () {
        var _a;
        if (!((_a = this.salaSeleccionada) === null || _a === void 0 ? void 0 : _a.asientos)) {
            return this.salaSeleccionada ? this.salaSeleccionada.filas * this.salaSeleccionada.asientosPorFila : 0;
        }
        return this.salaSeleccionada.asientos.filter(function (asiento) { return asiento.estado === 'DISPONIBLE'; }).length;
    };
    AdminSalasComponent.prototype.calcularAsientosDanados = function () {
        var _a;
        if (!((_a = this.salaSeleccionada) === null || _a === void 0 ? void 0 : _a.asientos))
            return 0;
        return this.salaSeleccionada.asientos.filter(function (asiento) { return asiento.estado === 'DANADO'; }).length;
    };
    AdminSalasComponent.prototype.formatearFecha = function (fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    AdminSalasComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-salas',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, forms_1.FormsModule],
            templateUrl: './admin-salas.component.html',
            styleUrls: ['./admin-salas.component.scss']
        })
    ], AdminSalasComponent);
    return AdminSalasComponent;
}());
exports.AdminSalasComponent = AdminSalasComponent;
