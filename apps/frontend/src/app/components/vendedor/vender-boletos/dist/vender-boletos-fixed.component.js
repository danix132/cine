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
exports.VenderBoletosComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var sala_model_1 = require("../../../models/sala.model");
var boleto_model_1 = require("../../../models/boleto.model");
var VenderBoletosComponent = /** @class */ (function () {
    function VenderBoletosComponent(funcionesService, salasService, boletosService, authService, router, cdr) {
        this.funcionesService = funcionesService;
        this.salasService = salasService;
        this.boletosService = boletosService;
        this.authService = authService;
        this.router = router;
        this.cdr = cdr;
        this.funciones = [];
        this.funcionesFiltradas = [];
        this.funcionSeleccionada = null;
        this.salaDetalles = null;
        this.boletosExistentes = [];
        // Estados de loading
        this.loading = false;
        this.loadingSala = false;
        this.procesandoVenta = false;
        // Estados del modal
        this.mostrarModalConfirmacion = false;
        this.mostrarModalExito = false;
        // Datos de la venta
        this.asientosSeleccionados = new Set();
        this.totalVenta = 0;
        this.boletosCreados = [];
        // Filtros
        this.filtroTitulo = '';
        this.filtroFecha = '';
        this.filtroHora = '';
        // Enums para el template
        this.AsientoEstado = sala_model_1.AsientoEstado;
        this.BoletoEstado = boleto_model_1.BoletoEstado;
    }
    VenderBoletosComponent.prototype.ngOnInit = function () {
        this.cargarFunciones();
    };
    VenderBoletosComponent.prototype.cargarFunciones = function () {
        var _this = this;
        this.loading = true;
        console.log('🎬 Cargando funciones disponibles...');
        this.funcionesService.getFunciones().subscribe({
            next: function (funciones) {
                console.log('✅ Funciones cargadas:', funciones.length);
                _this.funciones = funciones || [];
                _this.funcionesFiltradas = __spreadArrays(_this.funciones);
                _this.loading = false;
                // Debug de funciones
                console.log('📋 Primeras 5 funciones:', _this.funciones.slice(0, 5).map(function (f) {
                    var _a, _b;
                    return ({
                        id: f.id,
                        titulo: (_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.titulo,
                        fecha: f.fecha,
                        hora: f.hora,
                        sala: (_b = f.sala) === null || _b === void 0 ? void 0 : _b.nombre
                    });
                }));
            },
            error: function (error) {
                console.error('❌ Error al cargar funciones:', error);
                _this.loading = false;
                _this.funciones = [];
                _this.funcionesFiltradas = [];
            }
        });
    };
    VenderBoletosComponent.prototype.aplicarFiltros = function () {
        var _this = this;
        this.funcionesFiltradas = this.funciones.filter(function (funcion) {
            var _a;
            var matchTitulo = !_this.filtroTitulo || ((_a = funcion.pelicula) === null || _a === void 0 ? void 0 : _a.titulo.toLowerCase().includes(_this.filtroTitulo.toLowerCase()));
            var matchFecha = !_this.filtroFecha ||
                funcion.fecha === _this.filtroFecha;
            var matchHora = !_this.filtroHora ||
                funcion.hora.includes(_this.filtroHora);
            return matchTitulo && matchFecha && matchHora;
        });
    };
    VenderBoletosComponent.prototype.seleccionarFuncion = function (funcion) {
        console.log('🎯 Función seleccionada:', funcion);
        this.funcionSeleccionada = funcion;
        this.loadingSala = true;
        this.asientosSeleccionados.clear();
        this.totalVenta = 0;
        this.cargarSalaYBoletos(funcion.salaId);
    };
    VenderBoletosComponent.prototype.cargarSalaYBoletos = function (salaId) {
        var _this = this;
        console.log('🏛️ Cargando sala:', salaId);
        this.salasService.getSala(salaId).subscribe({
            next: function (sala) {
                var _a;
                console.log('✅ Sala cargada:', sala);
                _this.salaDetalles = sala;
                _this.loadingSala = false;
                // Debug de asientos
                console.log('💺 Total asientos:', ((_a = sala.asientos) === null || _a === void 0 ? void 0 : _a.length) || 0);
                // Cargar boletos existentes después de cargar la sala
                _this.cargarBoletosExistentes();
            },
            error: function (error) {
                console.error('❌ Error al cargar sala:', error);
                _this.loadingSala = false;
            }
        });
    };
    VenderBoletosComponent.prototype.cargarBoletosExistentes = function () {
        var _this = this;
        if (!this.funcionSeleccionada) {
            console.log('❌ No hay función seleccionada para cargar boletos');
            return;
        }
        console.log('🎫 Cargando boletos existentes para función:', this.funcionSeleccionada.id);
        this.boletosService.getBoletosPorFuncion(this.funcionSeleccionada.id).subscribe({
            next: function (boletos) {
                // Filtrar solo boletos activos (no cancelados)
                _this.boletosExistentes = (boletos || []).filter(function (b) {
                    return b.estado === 'PAGADO' || b.estado === 'RESERVADO';
                });
                console.log('✅ Boletos existentes cargados:', _this.boletosExistentes.length);
                console.log('📋 Detalle de boletos activos:', _this.boletosExistentes.map(function (b) { return ({
                    id: b.id,
                    asientoId: b.asientoId,
                    estado: b.estado,
                    asiento: b.asiento ? "Fila " + b.asiento.fila + ", Asiento " + b.asiento.numero : 'Sin asiento'
                }); }));
                // Verificar si los asientos tienen los datos completos
                var boletosSinAsiento = _this.boletosExistentes.filter(function (b) { return !b.asiento; });
                if (boletosSinAsiento.length > 0) {
                    console.warn('⚠️ Hay boletos sin información de asiento:', boletosSinAsiento);
                }
                // Ejecutar debug después de cargar boletos
                setTimeout(function () {
                    _this.debugAsientos();
                    _this.forzarActualizacionVista();
                }, 200);
            },
            error: function (error) {
                console.error('❌ Error al cargar boletos existentes:', error);
                _this.boletosExistentes = [];
            }
        });
    };
    VenderBoletosComponent.prototype.forzarActualizacionVista = function () {
        var _this = this;
        // Forzar detección de cambios inmediatamente
        this.cdr.detectChanges();
        // También forzar después de un timeout para elementos que se renderizan tarde
        setTimeout(function () {
            _this.cdr.detectChanges();
            var elementos = document.querySelectorAll('.asiento-vendedor');
            console.log("\uD83D\uDD04 Forzando actualizaci\u00F3n de " + elementos.length + " asientos");
            // Verificar qué asientos están siendo detectados como ocupados
            var ocupados = document.querySelectorAll('.asiento-vendedor.ocupado');
            console.log("\uD83D\uDEAB Asientos marcados como ocupados en DOM: " + ocupados.length);
            ocupados.forEach(function (el, index) {
                var _a;
                console.log("   " + (index + 1) + ". " + ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()));
            });
        }, 100);
    };
    VenderBoletosComponent.prototype.esAsientoOcupado = function (asiento) {
        if (!asiento || !asiento.id) {
            console.warn('⚠️ Asiento sin ID válido:', asiento);
            return false;
        }
        var boletoOcupante = this.boletosExistentes.find(function (boleto) {
            var coincideId = boleto.asientoId === asiento.id;
            var estadoOcupado = boleto.estado === 'PAGADO' || boleto.estado === 'RESERVADO';
            if (coincideId && estadoOcupado) {
                console.log("\uD83D\uDEAB ASIENTO OCUPADO: " + asiento.fila + "-" + asiento.numero + " (ID: " + asiento.id + ") ocupado por boleto " + boleto.id + " (Estado: " + boleto.estado + ")");
                return true;
            }
            return false;
        });
        return !!boletoOcupante;
    };
    VenderBoletosComponent.prototype.esAsientoDanado = function (asiento) {
        return asiento.estado === sala_model_1.AsientoEstado.DANADO;
    };
    VenderBoletosComponent.prototype.esAsientoSeleccionado = function (asiento) {
        return this.asientosSeleccionados.has(asiento.id);
    };
    VenderBoletosComponent.prototype.toggleAsiento = function (asiento) {
        console.log("\uD83E\uDE91 Click en asiento - Fila " + asiento.fila + ", N\u00FAmero " + asiento.numero + " (ID: " + asiento.id + ")");
        var ocupado = this.esAsientoOcupado(asiento);
        var danado = this.esAsientoDanado(asiento);
        console.log("  - Estado ocupado: " + ocupado);
        console.log("  - Estado da\u00F1ado: " + danado);
        if (ocupado) {
            alert('❌ Este asiento ya está ocupado');
            return;
        }
        if (danado) {
            alert('⚠️ Este asiento está dañado y no se puede seleccionar');
            return;
        }
        if (this.asientosSeleccionados.has(asiento.id)) {
            console.log('➖ Deseleccionando asiento');
            this.asientosSeleccionados["delete"](asiento.id);
        }
        else {
            console.log('➕ Seleccionando asiento');
            this.asientosSeleccionados.add(asiento.id);
        }
        console.log("\uD83D\uDCCA Total asientos seleccionados: " + this.asientosSeleccionados.size);
        this.calcularTotal();
    };
    VenderBoletosComponent.prototype.calcularTotal = function () {
        if (this.funcionSeleccionada) {
            this.totalVenta = this.asientosSeleccionados.size * this.funcionSeleccionada.precio;
        }
    };
    VenderBoletosComponent.prototype.confirmarVenta = function () {
        console.log('🎯 confirmarVenta() ejecutado');
        console.log('📊 Asientos seleccionados:', this.asientosSeleccionados.size);
        if (this.asientosSeleccionados.size === 0) {
            alert('Debe seleccionar al menos un asiento');
            return;
        }
        // VERIFICACIÓN ADICIONAL: Recargar boletos antes de confirmar
        console.log('🔄 Verificando disponibilidad de asientos antes de confirmar...');
        this.verificarDisponibilidadAsientos();
    };
    // Verificar disponibilidad en tiempo real antes de procesar
    VenderBoletosComponent.prototype.verificarDisponibilidadAsientos = function () {
        var _this = this;
        this.boletosService.getBoletosPorFuncion(this.funcionSeleccionada.id).subscribe({
            next: function (boletos) {
                console.log('🔍 Verificación en tiempo real - boletos actuales:', (boletos === null || boletos === void 0 ? void 0 : boletos.length) || 0);
                var boletosActivos = (boletos || []).filter(function (b) {
                    return b.estado === 'PAGADO' || b.estado === 'RESERVADO';
                });
                // Verificar si algún asiento seleccionado ya está ocupado
                var asientosOcupados = [];
                _this.asientosSeleccionados.forEach(function (asientoId) {
                    var _a, _b;
                    var yaOcupado = boletosActivos.find(function (b) { return b.asientoId === asientoId; });
                    if (yaOcupado) {
                        var asiento = (_b = (_a = _this.salaDetalles) === null || _a === void 0 ? void 0 : _a.asientos) === null || _b === void 0 ? void 0 : _b.find(function (a) { return a.id === asientoId; });
                        asientosOcupados.push(asiento ? asiento.fila + "-" + asiento.numero : asientoId);
                    }
                });
                if (asientosOcupados.length > 0) {
                    console.error('❌ Asientos ocupados detectados:', asientosOcupados);
                    alert("\u274C Los siguientes asientos ya fueron vendidos:\n\n" + asientosOcupados.join(', ') + "\n\n\uD83D\uDD04 Actualizando mapa de asientos...");
                    // Actualizar datos y limpiar selección
                    _this.boletosExistentes = boletosActivos;
                    _this.asientosSeleccionados.clear();
                    _this.calcularTotal();
                    _this.forzarActualizacionVista();
                    return;
                }
                // Si todo está bien, proceder con la venta
                console.log('✅ Todos los asientos están disponibles, procediendo...');
                _this.calcularTotal();
                console.log('💰 Total calculado:', _this.totalVenta);
                console.log('🎬 Función seleccionada:', _this.funcionSeleccionada);
                _this.mostrarModalConfirmacion = true;
                console.log('🔄 mostrarModalConfirmacion establecido a:', _this.mostrarModalConfirmacion);
                // Debug: Verificar que el elemento modal se muestra
                setTimeout(function () {
                    var modalElement = document.querySelector('.modal');
                    if (modalElement) {
                        console.log('✅ Modal existe en DOM');
                        var styles = getComputedStyle(modalElement);
                        console.log('Display:', styles.display, 'Z-index:', styles.zIndex, 'Position:', styles.position);
                    }
                    else {
                        console.log('❌ Modal NO encontrado en DOM');
                    }
                }, 100);
                // Force change detection
                setTimeout(function () {
                    console.log('⏰ Verificando modal después de timeout:', _this.mostrarModalConfirmacion);
                }, 100);
            },
            error: function (error) {
                console.error('❌ Error al verificar disponibilidad:', error);
                alert('Error al verificar disponibilidad de asientos. Intente nuevamente.');
            }
        });
    };
    VenderBoletosComponent.prototype.procesarVenta = function () {
        var _this = this;
        console.log('🚀 Iniciando procesarVenta()');
        if (!this.funcionSeleccionada) {
            console.log('❌ No hay función seleccionada');
            return;
        }
        console.log('📋 Función seleccionada:', this.funcionSeleccionada);
        console.log('💺 Asientos seleccionados:', Array.from(this.asientosSeleccionados));
        this.procesandoVenta = true;
        var boletosPromises = [];
        // Obtener el usuario actual
        var currentUser = this.authService.getCurrentUser();
        console.log('👤 Usuario actual para la venta:', currentUser);
        // Verificación adicional del token
        var token = this.authService.getToken();
        console.log('🔑 Token disponible:', !!token, token ? token.length + " chars" : 'No token');
        if (!currentUser || !token) {
            console.error('❌ Usuario no autenticado o token faltante');
            this.procesandoVenta = false;
            alert('Error de autenticación. Por favor inicie sesión nuevamente.');
            return;
        }
        if (!currentUser.id) {
            console.error('❌ ID de usuario faltante');
            this.procesandoVenta = false;
            alert('Error: ID de usuario no encontrado.');
            return;
        }
        // Crear un boleto por cada asiento seleccionado - directamente como PAGADO
        this.asientosSeleccionados.forEach(function (asientoId, index) {
            var boletoRequest = {
                funcionId: _this.funcionSeleccionada.id,
                asientoId: asientoId,
                usuarioId: currentUser.id,
                precio: _this.funcionSeleccionada.precio,
                estado: 'PAGADO' // Crear directamente como PAGADO
            };
            console.log("\uD83C\uDFAB Creando boleto " + (index + 1) + ":", boletoRequest);
            var boletoObservable = _this.boletosService.createBoleto(boletoRequest).toPromise();
            boletosPromises.push(boletoObservable);
        });
        // Procesar todos los boletos
        Promise.all(boletosPromises)
            .then(function (boletos) {
            console.log('✅ Todos los boletos creados:', boletos);
            // Filtrar boletos exitosos (no undefined)
            _this.boletosCreados = boletos.filter(function (b) { return b !== undefined; });
            _this.procesandoVenta = false;
            _this.mostrarModalConfirmacion = false;
            _this.mostrarModalExito = true;
            // Limpiar selección
            console.log('🧹 Limpiando selección después de venta exitosa');
            _this.asientosSeleccionados.clear();
            _this.totalVenta = 0;
            // Recargar boletos para actualizar la vista
            _this.cargarBoletosExistentes();
            console.log('✅ Proceso de venta completado exitosamente');
        })["catch"](function (error) {
            console.error('❌ Error completo al procesar venta:', error);
            console.error('📊 Detalles del error:');
            console.error('- Message:', error.message);
            console.error('- Status:', error.status);
            console.error('- Error object:', error.error);
            console.error('- Full response:', error);
            _this.procesandoVenta = false;
            alert('Error al procesar la venta. Por favor intente nuevamente.');
        });
    };
    VenderBoletosComponent.prototype.cancelarVenta = function () {
        console.log('❌ cancelarVenta() ejecutado');
        if (this.procesandoVenta) {
            console.log('⏸️ No se puede cancelar, procesando venta...');
            return; // No permitir cerrar durante procesamiento
        }
        this.mostrarModalConfirmacion = false;
        this.asientosSeleccionados.clear();
        this.totalVenta = 0;
        console.log('🔄 Modal cerrado y datos limpiados');
    };
    VenderBoletosComponent.prototype.cerrarModalExito = function () {
        this.mostrarModalExito = false;
        this.boletosCreados = [];
    };
    VenderBoletosComponent.prototype.imprimirBoletos = function () {
        // Implementar lógica de impresión
        console.log('Imprimiendo boletos:', this.boletosCreados);
        // Por ahora solo mostrar en consola
        window.print();
    };
    VenderBoletosComponent.prototype.volver = function () {
        this.funcionSeleccionada = null;
        this.salaDetalles = null;
        this.asientosSeleccionados.clear();
        this.totalVenta = 0;
    };
    VenderBoletosComponent.prototype.volverInicio = function () {
        this.router.navigate(['/vendedor']);
    };
    // Métodos de utilidad para el template
    VenderBoletosComponent.prototype.getFilasArray = function (sala) {
        return Array.from({ length: sala.filas }, function (_, i) { return i + 1; });
    };
    VenderBoletosComponent.prototype.getLabelFila = function (index) {
        return String.fromCharCode(65 + index); // A, B, C, etc.
    };
    VenderBoletosComponent.prototype.getPrimerGrupoAsientos = function (sala) {
        var mitad = Math.ceil(sala.asientosPorFila / 2);
        return Array.from({ length: mitad }, function (_, i) { return i + 1; });
    };
    VenderBoletosComponent.prototype.getSegundoGrupoAsientos = function (sala) {
        var mitad = Math.ceil(sala.asientosPorFila / 2);
        var resto = sala.asientosPorFila - mitad;
        return Array.from({ length: resto }, function (_, i) { return i + 1; });
    };
    VenderBoletosComponent.prototype.getAsientoPorPosicion = function (fila, numero) {
        var _a;
        if (!((_a = this.salaDetalles) === null || _a === void 0 ? void 0 : _a.asientos))
            return undefined;
        return this.salaDetalles.asientos.find(function (a) { return a.fila === fila && a.numero === numero; });
    };
    VenderBoletosComponent.prototype.formatearFecha = function (fecha) {
        var date = new Date(fecha);
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };
    VenderBoletosComponent.prototype.formatearHora = function (fecha) {
        var date = new Date(fecha);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    VenderBoletosComponent.prototype.formatearPrecio = function (precio) {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU'
        }).format(precio);
    };
    VenderBoletosComponent.prototype.debugAsientos = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        console.log('🔍 DEBUG - Estado de asientos:');
        console.log('- Sala detalles:', this.salaDetalles);
        console.log('- Boletos existentes:', this.boletosExistentes.length);
        if (this.salaDetalles) {
            console.log('- Total asientos en sala:', ((_a = this.salaDetalles.asientos) === null || _a === void 0 ? void 0 : _a.length) || 0);
            // Mostrar ejemplo de los primeros asientos y su estado
            var ejemploAsientos = ((_b = this.salaDetalles.asientos) === null || _b === void 0 ? void 0 : _b.slice(0, 10)) || [];
            ejemploAsientos.forEach(function (asiento) {
                var ocupado = _this.esAsientoOcupado(asiento);
                var danado = _this.esAsientoDanado(asiento);
                var seleccionado = _this.esAsientoSeleccionado(asiento);
                console.log("  Asiento " + asiento.fila + "-" + asiento.numero + " (" + asiento.id + "): Ocupado=" + ocupado + ", Da\u00F1ado=" + danado + ", Seleccionado=" + seleccionado);
            });
            // Estadísticas generales
            var total = ((_c = this.salaDetalles.asientos) === null || _c === void 0 ? void 0 : _c.length) || 0;
            var ocupados = ((_d = this.salaDetalles.asientos) === null || _d === void 0 ? void 0 : _d.filter(function (a) { return _this.esAsientoOcupado(a); }).length) || 0;
            var danados = ((_e = this.salaDetalles.asientos) === null || _e === void 0 ? void 0 : _e.filter(function (a) { return _this.esAsientoDanado(a); }).length) || 0;
            console.log("\uD83D\uDCCA Resumen: " + total + " total, " + ocupados + " ocupados, " + danados + " da\u00F1ados, " + this.asientosSeleccionados.size + " seleccionados");
        }
    };
    VenderBoletosComponent.prototype.getAsientoContenido = function (asiento) {
        if (this.esAsientoOcupado(asiento))
            return '✗';
        if (this.esAsientoDanado(asiento))
            return '⚠';
        if (this.esAsientoSeleccionado(asiento))
            return '✓';
        return asiento.numero.toString();
    };
    VenderBoletosComponent = __decorate([
        core_1.Component({
            selector: 'app-vender-boletos',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
            templateUrl: './vender-boletos.component.html',
            styleUrls: ['./vender-boletos.component.scss']
        })
    ], VenderBoletosComponent);
    return VenderBoletosComponent;
}());
exports.VenderBoletosComponent = VenderBoletosComponent;
