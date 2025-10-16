"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.VenderBoletosComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var sala_model_1 = require("../../../models/sala.model");
var boleto_model_1 = require("../../../models/boleto.model");
var QRCode = require("qrcode");
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
        this.imprimiendo = false;
        this.impresionExitosa = false;
        // Estados del modal
        this.mostrarModalConfirmacion = false;
        this.mostrarModalExito = false;
        // Datos de la venta
        this.asientosSeleccionados = new Set();
        this.totalVenta = 0;
        this.totalVentaCompletada = 0; // Mantiene el total de la venta exitosa para mostrar en el modal
        this.boletosCreados = [];
        // Filtros
        this.filtroTitulo = '';
        this.filtroFecha = '';
        this.filtroHora = '';
        this.filtroPelicula = '';
        this.filtroSala = '';
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
            next: function (response) {
                console.log('✅ Respuesta funciones:', response);
                // Si es una respuesta paginada, usar la propiedad data
                var funcionesData = (response === null || response === void 0 ? void 0 : response.data) || response || [];
                _this.funciones = Array.isArray(funcionesData) ? funcionesData : [funcionesData];
                // Aplicar filtros incluyendo el filtro de funciones vencidas
                _this.aplicarFiltros();
                _this.loading = false;
                console.log('📋 Funciones cargadas:', _this.funciones.length);
                // Debug de funciones
                console.log('📋 Primeras 5 funciones:', _this.funciones.slice(0, 5).map(function (f) {
                    var _a, _b;
                    return ({
                        id: f.id,
                        titulo: (_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.titulo,
                        inicio: f.inicio,
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
            var _a, _b, _c, _d, _e;
            // Filtros de búsqueda
            var matchTitulo = !_this.filtroTitulo || ((_a = funcion.pelicula) === null || _a === void 0 ? void 0 : _a.titulo.toLowerCase().includes(_this.filtroTitulo.toLowerCase()));
            var matchPelicula = !_this.filtroPelicula || ((_b = funcion.pelicula) === null || _b === void 0 ? void 0 : _b.titulo.toLowerCase().includes(_this.filtroPelicula.toLowerCase()));
            var matchSala = !_this.filtroSala || ((_c = funcion.sala) === null || _c === void 0 ? void 0 : _c.nombre.toLowerCase().includes(_this.filtroSala.toLowerCase()));
            var matchFecha = !_this.filtroFecha || ((_d = funcion.inicio) === null || _d === void 0 ? void 0 : _d.includes(_this.filtroFecha));
            var matchHora = !_this.filtroHora || ((_e = funcion.inicio) === null || _e === void 0 ? void 0 : _e.includes(_this.filtroHora));
            // Filtro de funciones vencidas
            var noEstaVencida = !_this.deberiaOcultarFuncionesVencidas() || !_this.esFuncionVencida(funcion);
            return matchTitulo && matchPelicula && matchSala && matchFecha && matchHora && noEstaVencida;
        });
        // Debug para ver cuántas funciones se filtraron
        if (this.deberiaOcultarFuncionesVencidas()) {
            var vencidas = this.funciones.filter(function (f) { return _this.esFuncionVencida(f); });
            console.log("\uD83D\uDD50 Funciones vencidas ocultas: " + vencidas.length + " de " + this.funciones.length);
        }
    };
    VenderBoletosComponent.prototype.limpiarFiltros = function () {
        this.filtroTitulo = '';
        this.filtroPelicula = '';
        this.filtroSala = '';
        this.filtroFecha = '';
        this.filtroHora = '';
        this.aplicarFiltros();
    };
    VenderBoletosComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroTitulo || this.filtroPelicula || this.filtroSala || this.filtroFecha || this.filtroHora);
    };
    VenderBoletosComponent.prototype.esFuncionVencida = function (funcion) {
        if (!funcion.inicio) {
            return false;
        }
        var fechaInicio = new Date(funcion.inicio);
        var ahora = new Date();
        // Considerar vencida si ya pasó la fecha/hora de inicio
        return fechaInicio < ahora;
    };
    VenderBoletosComponent.prototype.deberiaOcultarFuncionesVencidas = function () {
        // Solo ocultar funciones vencidas si NO hay filtros activos
        // Si hay filtros, mostrar todo para que el usuario pueda buscar funciones pasadas
        return !this.hayFiltrosActivos();
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
    // Función para contar asientos disponibles por función específica
    VenderBoletosComponent.prototype.contarAsientosDisponiblesPorFuncion = function (funcion) {
        var _a, _b;
        if (!funcion.sala)
            return 0;
        var totalAsientos = funcion.sala.filas * funcion.sala.asientosPorFila;
        // Contar asientos dañados en la sala
        var asientosDanados = ((_a = funcion.sala.asientos) === null || _a === void 0 ? void 0 : _a.filter(function (a) {
            return a.estado === sala_model_1.AsientoEstado.DANADO;
        }).length) || 0;
        // Contar boletos vendidos para esta función específica
        var boletosVendidos = ((_b = funcion._count) === null || _b === void 0 ? void 0 : _b.boletos) || 0;
        // Asientos disponibles = Total - Dañados - Vendidos
        var disponibles = totalAsientos - asientosDanados - boletosVendidos;
        return Math.max(0, disponibles); // Asegurar que no sea negativo
    };
    VenderBoletosComponent.prototype.toggleAsiento = function (asiento) {
        console.log("\uD83E\uDE91 Click en asiento - Fila " + asiento.fila + ", N\u00FAmero " + asiento.numero + " (ID: " + asiento.id + ")");
        // Modo normal de selección de asientos para venta
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
                estado: 'PAGADO',
                vendedorId: currentUser.id,
                precio: Number(_this.funcionSeleccionada.precio) // Precio del boleto para reportes
            };
            console.log("\uD83C\uDFAB Creando boleto " + (index + 1) + ":", boletoRequest);
            console.log("\uD83D\uDCB0 Precio de la funci\u00F3n: $" + _this.funcionSeleccionada.precio + " (se incluye en request para reportes)");
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
            // Guardar el total antes de limpiar
            _this.totalVentaCompletada = _this.totalVenta;
            console.log('💰 Total de venta completada guardado:', _this.totalVentaCompletada);
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
            // Extraer mensaje específico del backend
            var errorMessage = 'Error al procesar la venta. Por favor intente nuevamente.';
            if (error.error && error.error.message) {
                if (Array.isArray(error.error.message)) {
                    errorMessage = 'Errores de validación:\n' + error.error.message.join('\n');
                }
                else {
                    errorMessage = error.error.message;
                }
            }
            console.error('🚨 Mensaje de error específico:', errorMessage);
            _this.procesandoVenta = false;
            alert(errorMessage);
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
        this.totalVentaCompletada = 0; // Limpiar el total después de cerrar el modal
    };
    VenderBoletosComponent.prototype.irANuevaVenta = function () {
        console.log('🔄 Navegando a nueva venta manualmente...');
        // Cerrar el modal
        this.cerrarModalExito();
        // Forzar detección de cambios
        this.cdr.detectChanges();
        // Navegar a vendedor/boletos
        this.router.navigate(['/vendedor/boletos']).then(function (success) {
            if (success) {
                console.log('✅ Navegación manual completada a /vendedor/boletos');
            }
            else {
                console.warn('⚠️ La navegación manual no se completó, recargando página...');
                window.location.reload();
            }
        })["catch"](function (error) {
            console.error('❌ Error en navegación manual:', error);
            window.location.href = '/vendedor/boletos';
        });
    };
    VenderBoletosComponent.prototype.programarRedirecion = function () {
        var _this = this;
        console.log('📋 Programando redirección a vendedor/boletos...');
        setTimeout(function () {
            // Solo redirigir si la impresión fue exitosa
            if (!_this.impresionExitosa) {
                console.log('❌ No se redirige porque la impresión no fue exitosa');
                return;
            }
            console.log('🔄 Ejecutando redirección a vendedor/boletos después de la impresión exitosa...');
            try {
                // Cerrar el modal antes de redireccionar
                _this.cerrarModalExito();
                // Forzar detección de cambios
                _this.cdr.detectChanges();
                // Ejecutar redirección
                _this.router.navigate(['/vendedor/boletos']).then(function (success) {
                    if (success) {
                        console.log('✅ Redirección completada exitosamente a /vendedor/boletos');
                        // Resetear el flag
                        _this.impresionExitosa = false;
                    }
                    else {
                        console.warn('⚠️ La redirección no se completó correctamente');
                        // Fallback: redirección manual
                        window.location.href = '/vendedor/boletos';
                    }
                })["catch"](function (error) {
                    console.error('❌ Error al redireccionar:', error);
                    // Fallback: redirección manual
                    window.location.href = '/vendedor/boletos';
                });
            }
            catch (error) {
                console.error('❌ Error en el proceso de redirección:', error);
                // Fallback: redirección manual
                window.location.href = '/vendedor/boletos';
            }
        }, 4000); // Aumentar a 4 segundos para dar más tiempo
    };
    VenderBoletosComponent.prototype.imprimirBoletos = function () {
        return __awaiter(this, void 0, Promise, function () {
            var testQR, htmlImpresion, ventanaImpresion_1, error_1, htmlSimple, ventanaImpresion_2, simpleError_1, htmlBasico, ventanaImpresion_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.boletosCreados || this.boletosCreados.length === 0) {
                            alert('No hay boletos para imprimir');
                            return [2 /*return*/];
                        }
                        if (this.imprimiendo) {
                            console.log('⏸️ Ya se está imprimiendo, esperando...');
                            return [2 /*return*/];
                        }
                        this.imprimiendo = true;
                        this.impresionExitosa = false; // Resetear el flag
                        console.log('🖨️ Preparando impresión de boletos:', this.boletosCreados);
                        console.log('🎬 Función seleccionada:', this.funcionSeleccionada);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 9, 10]);
                        // Primero probar si QRCode funciona
                        console.log('🧪 Probando generación de QR...');
                        return [4 /*yield*/, QRCode.toDataURL('TEST_QR_CODE')];
                    case 2:
                        testQR = _a.sent();
                        console.log('✅ QRCode funciona correctamente, resultado:', testQR.substring(0, 50) + '...');
                        console.log('📄 Generando HTML de impresión...');
                        return [4 /*yield*/, this.generarHTMLImpresion()];
                    case 3:
                        htmlImpresion = _a.sent();
                        console.log('✅ HTML generado exitosamente, longitud:', htmlImpresion.length);
                        // Mostrar mensaje al usuario
                        console.log('🖨️ Iniciando impresión directa...');
                        ventanaImpresion_1 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                        if (!ventanaImpresion_1) {
                            alert('No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.');
                            return [2 /*return*/];
                        }
                        // Escribir el HTML en la nueva ventana
                        ventanaImpresion_1.document.write(htmlImpresion);
                        ventanaImpresion_1.document.close();
                        // Agregar título a la ventana
                        ventanaImpresion_1.document.title = 'Vista Previa - Recibo de Boletos';
                        // Esperar a que la ventana cargue completamente y luego imprimir automáticamente
                        ventanaImpresion_1.onload = function () {
                            setTimeout(function () {
                                ventanaImpresion_1.print();
                                // No cerrar automáticamente para que el usuario pueda revisar
                                // El usuario puede cerrar manualmente después de imprimir
                            }, 300);
                        };
                        console.log('🖨️ Impresión iniciada automáticamente con ventana popup');
                        // Marcar impresión como exitosa
                        this.impresionExitosa = true;
                        // Mostrar notificación de éxito y próxima redirección
                        setTimeout(function () {
                            alert('✅ Vista previa de boletos abierta. Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
                        }, 500);
                        return [3 /*break*/, 10];
                    case 4:
                        error_1 = _a.sent();
                        console.error('❌ Error al imprimir boletos:', error_1);
                        console.error('❌ Stack trace completo:', error_1.stack);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        console.log('🔄 Intentando impresión con HTML simple y QR...');
                        return [4 /*yield*/, this.generarHTMLSimpleConQR()];
                    case 6:
                        htmlSimple = _a.sent();
                        ventanaImpresion_2 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                        if (ventanaImpresion_2) {
                            ventanaImpresion_2.document.write(htmlSimple);
                            ventanaImpresion_2.document.close();
                            ventanaImpresion_2.document.title = 'Vista Previa - Boletos (Versión Simple)';
                            ventanaImpresion_2.onload = function () {
                                setTimeout(function () {
                                    ventanaImpresion_2.print();
                                    // No cerrar automáticamente para que el usuario pueda ver
                                }, 300);
                            };
                            console.log('🖨️ Impresión con HTML simplificado iniciada automáticamente');
                            // Marcar impresión como exitosa
                            this.impresionExitosa = true;
                            // Notificación de éxito para respaldo simple
                            setTimeout(function () {
                                alert('✅ Vista previa de boletos abierta (versión simplificada). Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
                            }, 500);
                            return [2 /*return*/]; // Salir si funcionó
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        simpleError_1 = _a.sent();
                        console.error('❌ Error en impresión simple con QR:', simpleError_1);
                        return [3 /*break*/, 8];
                    case 8:
                        // Como último recurso, intentar sin QR
                        try {
                            console.log('🔄 Último recurso: impresión sin códigos QR...');
                            htmlBasico = this.generarHTMLSinQR();
                            ventanaImpresion_3 = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                            if (ventanaImpresion_3) {
                                ventanaImpresion_3.document.write(htmlBasico);
                                ventanaImpresion_3.document.close();
                                ventanaImpresion_3.document.title = 'Vista Previa - Boletos (Sin Códigos QR)';
                                ventanaImpresion_3.onload = function () {
                                    setTimeout(function () {
                                        ventanaImpresion_3.print();
                                        // No cerrar automáticamente para que el usuario pueda ver
                                    }, 300);
                                };
                                console.log('🖨️ Impresión básica sin QR iniciada automáticamente');
                                // Marcar impresión como exitosa
                                this.impresionExitosa = true;
                                alert('✅ Vista previa de boletos abierta (sin códigos QR). Los códigos están mostrados como texto. Usa Ctrl+P para imprimir. Serás redirigido a venta de boletos en unos momentos...');
                            }
                            else {
                                throw new Error('No se pudo abrir ventana de impresión');
                            }
                        }
                        catch (backupError) {
                            console.error('❌ Error en impresión de respaldo:', backupError);
                            alert("Error al generar la impresi\u00F3n: " + error_1.message + ". Int\u00E9ntalo nuevamente.");
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        this.imprimiendo = false;
                        // Programar redirección después de completar la impresión
                        this.programarRedirecion();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    VenderBoletosComponent.prototype.generarHTMLImpresion = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __awaiter(this, void 0, Promise, function () {
            var totalBoletos, precioUnitario, totalVenta, fechaVenta, html, i, boleto, codigoQRLimpio, qrDataURL, qrFirstError_1, asiento, filaLetra, numeroAsiento, qrError_1, asiento, filaLetra, numeroAsiento;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        console.log('🔧 Iniciando generación de HTML...');
                        totalBoletos = this.boletosCreados.length;
                        precioUnitario = ((_a = this.funcionSeleccionada) === null || _a === void 0 ? void 0 : _a.precio) || 0;
                        totalVenta = totalBoletos * precioUnitario;
                        fechaVenta = new Date();
                        console.log('📊 Datos calculados:', { totalBoletos: totalBoletos, precioUnitario: precioUnitario, totalVenta: totalVenta });
                        html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"UTF-8\">\n        <title>Recibo de Venta - Cine Digital</title>\n        <style>\n          @page {\n            size: A4;\n            margin: 1cm;\n          }\n          \n          body {\n            font-family: 'Segoe UI', Arial, sans-serif;\n            font-size: 10px;\n            line-height: 1.3;\n            color: #000;\n            background: white;\n            margin: 0;\n            padding: 0;\n          }\n          \n          .recibo-container {\n            max-width: 100%;\n            margin: 0 auto;\n            padding: 10px;\n          }\n          \n          .recibo-header {\n            text-align: center;\n            border-bottom: 2px solid #333;\n            padding-bottom: 10px;\n            margin-bottom: 15px;\n          }\n          \n          .cinema-logo {\n            font-size: 28px;\n            font-weight: bold;\n            color: #333;\n            margin-bottom: 10px;\n          }\n          \n          .recibo-titulo {\n            font-size: 20px;\n            font-weight: bold;\n            margin-bottom: 10px;\n            color: #666;\n          }\n          \n          .fecha-hora-venta {\n            font-size: 14px;\n            color: #888;\n          }\n          \n          .resumen-venta {\n            background: #f8f9fa;\n            border: 2px solid #dee2e6;\n            border-radius: 8px;\n            padding: 15px;\n            margin-bottom: 15px;\n          }\n          \n          .resumen-titulo {\n            font-size: 18px;\n            font-weight: bold;\n            margin-bottom: 20px;\n            color: #333;\n            border-bottom: 2px solid #eee;\n            padding-bottom: 10px;\n          }\n          \n          .resumen-item {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 12px;\n            padding: 8px 0;\n            font-size: 14px;\n          }\n          \n          .resumen-item.total {\n            border-top: 3px solid #333;\n            padding-top: 15px;\n            margin-top: 20px;\n            font-weight: bold;\n            font-size: 18px;\n            color: #28a745;\n          }\n          \n          .boletos-seccion {\n            margin-bottom: 40px;\n          }\n          \n          .seccion-titulo {\n            font-size: 18px;\n            font-weight: bold;\n            margin-bottom: 25px;\n            color: #333;\n            border-bottom: 2px solid #eee;\n            padding-bottom: 10px;\n          }\n          \n          .boletos-grid {\n            display: grid;\n            gap: 15px;\n            grid-template-columns: 1fr;\n          }\n          \n          .boleto-item {\n            border: 2px solid #333;\n            border-radius: 8px;\n            overflow: hidden;\n            display: flex;\n            min-height: 120px;\n            max-height: 150px;\n            page-break-inside: avoid;\n            box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n            margin-bottom: 10px;\n          }\n          \n          /* Permitir hasta 3 boletos por p\u00E1gina */\n          .boleto-item:nth-child(3n+1) {\n            page-break-before: auto;\n          }\n          \n          .boleto-info {\n            flex: 2;\n            padding: 15px;\n            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);\n            font-size: 9px;\n          }\n          \n          .boleto-qr-section {\n            flex: 1;\n            padding: 10px;\n            border-left: 2px dashed #333;\n            text-align: center;\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n            align-items: center;\n            background: white;\n          }\n          \n          .boleto-numero {\n            background: #333;\n            color: white;\n            padding: 5px 10px;\n            border-radius: 12px;\n            font-weight: bold;\n            font-size: 10px;\n            margin-bottom: 8px;\n            display: inline-block;\n          }\n          \n          .pelicula-titulo {\n            font-size: 12px;\n            font-weight: bold;\n            color: #333;\n            margin-bottom: 8px;\n            text-align: left;\n            border-bottom: 1px solid #dee2e6;\n            padding-bottom: 5px;\n          }\n          \n          .funcion-detalles {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 5px;\n            margin-bottom: 8px;\n          }\n          \n          .detalle-item {\n            padding: 4px 6px;\n            background: rgba(255, 255, 255, 0.9);\n            border-radius: 4px;\n            border: 1px solid #dee2e6;\n          }\n          \n          .detalle-label {\n            font-weight: bold;\n            color: #666;\n            font-size: 7px;\n            text-transform: uppercase;\n            display: block;\n            margin-bottom: 2px;\n          }\n          \n          .detalle-valor {\n            color: #333;\n            font-size: 9px;\n            font-weight: 600;\n          }\n          \n          .asiento-destacado {\n            background: linear-gradient(135deg, #333 0%, #555 100%);\n            color: white;\n            padding: 6px;\n            border-radius: 6px;\n            text-align: center;\n            font-weight: bold;\n            font-size: 11px;\n            margin: 5px 0;\n            box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n          }\n          \n          .precio-boleto {\n            text-align: center;\n            font-size: 11px;\n            font-weight: bold;\n            color: #28a745;\n            margin-top: 5px;\n            padding: 4px;\n            background: rgba(40, 167, 69, 0.1);\n            border-radius: 4px;\n          }\n          \n          .qr-code img {\n            width: 80px !important;\n            height: 80px !important;\n          }\n          \n          .codigo-texto {\n            font-size: 6px;\n            color: #666;\n            margin-top: 5px;\n            word-break: break-all;\n            line-height: 1.2;\n          }\n          \n          /* Control de saltos de p\u00E1gina para m\u00FAltiples boletos */\n          .boletos-grid .boleto-item:nth-child(1),\n          .boletos-grid .boleto-item:nth-child(2),\n          .boletos-grid .boleto-item:nth-child(3) {\n            page-break-before: avoid;\n            break-inside: avoid;\n          }\n          \n          .boletos-grid .boleto-item:nth-child(4),\n          .boletos-grid .boleto-item:nth-child(5),\n          .boletos-grid .boleto-item:nth-child(6) {\n            page-break-before: avoid;\n            break-inside: avoid;\n          }\n          \n          /* Forzar nueva p\u00E1gina cada 3 boletos */\n          .boletos-grid .boleto-item:nth-child(4) {\n            page-break-before: always;\n          }\n          \n          .boletos-grid .boleto-item:nth-child(7) {\n            page-break-before: always;\n          }\n          \n          /* Optimizaci\u00F3n para pantallas peque\u00F1as */\n          @media print {\n            body {\n              font-size: 9px;\n            }\n            \n            .boleto-item {\n              min-height: 110px;\n              max-height: 130px;\n            }\n            \n            .qr-code img {\n              width: 70px !important;\n              height: 70px !important;\n            }\n          }\n          \n          /* Estilos para vista previa en pantalla */\n          @media screen {\n            body {\n              background: #f5f5f5;\n              padding: 20px;\n            }\n            \n            .recibo-container {\n              background: white;\n              box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n              border-radius: 8px;\n              max-width: 800px;\n              margin: 0 auto;\n            }\n            \n            /* Bot\u00F3n de impresi\u00F3n flotante para vista previa */\n            body::after {\n              content: \"\uD83D\uDC46 Presiona Ctrl+P para imprimir o usa el bot\u00F3n de impresi\u00F3n del navegador\";\n              position: fixed;\n              top: 10px;\n              right: 10px;\n              background: #007bff;\n              color: white;\n              padding: 10px 15px;\n              border-radius: 5px;\n              font-size: 12px;\n              z-index: 1000;\n              box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n            }\n          }\n          \n          .qr-code {\n            margin-bottom: 20px;\n          }\n          \n          .qr-code img {\n            border: 3px solid #333;\n            border-radius: 10px;\n            box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n          }\n          \n          .codigo-texto {\n            font-size: 9px;\n            color: #666;\n            word-break: break-all;\n            max-width: 140px;\n            margin-top: 10px;\n            line-height: 1.2;\n          }\n          \n          .recibo-footer {\n            border-top: 3px solid #333;\n            padding-top: 25px;\n            text-align: center;\n            margin-top: 50px;\n          }\n          \n          .terminos {\n            font-size: 12px;\n            color: #666;\n            line-height: 1.6;\n            margin-bottom: 20px;\n            max-width: 600px;\n            margin-left: auto;\n            margin-right: auto;\n          }\n          \n          .contacto {\n            font-size: 14px;\n            font-weight: bold;\n            color: #333;\n          }\n          \n          @media print {\n            body {\n              -webkit-print-color-adjust: exact;\n              print-color-adjust: exact;\n            }\n            \n            .boleto-item {\n              page-break-inside: avoid;\n              break-inside: avoid;\n            }\n            \n            .recibo-container {\n              padding: 0;\n            }\n          }\n          \n          @media screen {\n            .recibo-container {\n              max-height: 85vh;\n              overflow-y: auto;\n              border: 1px solid #ddd;\n              border-radius: 10px;\n            }\n            \n            .recibo-container::-webkit-scrollbar {\n              width: 14px;\n            }\n            \n            .recibo-container::-webkit-scrollbar-track {\n              background: #f1f1f1;\n              border-radius: 7px;\n            }\n            \n            .recibo-container::-webkit-scrollbar-thumb {\n              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n              border-radius: 7px;\n              border: 2px solid #f1f1f1;\n            }\n            \n            .recibo-container::-webkit-scrollbar-thumb:hover {\n              background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);\n            }\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"recibo-container\">\n          <div class=\"recibo-header\">\n            <div class=\"cinema-logo\">\uD83C\uDFAC CINE DIGITAL \uD83C\uDFAC</div>\n            <div class=\"recibo-titulo\">RECIBO DE VENTA DE BOLETOS</div>\n            <div class=\"fecha-hora-venta\">\n              \uD83D\uDCC5 " + this.formatearFecha(fechaVenta.toISOString()) + " \u2022 \uD83D\uDD50 " + this.formatearHora(fechaVenta.toISOString()) + "\n            </div>\n          </div>\n          \n          <div class=\"resumen-venta\">\n            <div class=\"resumen-titulo\">\uD83D\uDCCB Resumen de la Compra</div>\n            <div class=\"resumen-item\">\n              <span><strong>\uD83C\uDFAC Pel\u00EDcula:</strong></span>\n              <span>" + (((_c = (_b = this.funcionSeleccionada) === null || _b === void 0 ? void 0 : _b.pelicula) === null || _c === void 0 ? void 0 : _c.titulo) || 'N/A') + "</span>\n            </div>\n            <div class=\"resumen-item\">\n              <span><strong>\uD83D\uDCC5 Funci\u00F3n:</strong></span>\n              <span>" + this.formatearFecha(((_d = this.funcionSeleccionada) === null || _d === void 0 ? void 0 : _d.inicio) || '') + " - " + this.formatearHora(((_e = this.funcionSeleccionada) === null || _e === void 0 ? void 0 : _e.inicio) || '') + "</span>\n            </div>\n            <div class=\"resumen-item\">\n              <span><strong>\uD83C\uDFE2 Sala:</strong></span>\n              <span>" + (((_g = (_f = this.funcionSeleccionada) === null || _f === void 0 ? void 0 : _f.sala) === null || _g === void 0 ? void 0 : _g.nombre) || 'N/A') + "</span>\n            </div>\n            <div class=\"resumen-item\">\n              <span><strong>\uD83C\uDFAB Cantidad de boletos:</strong></span>\n              <span>" + totalBoletos + "</span>\n            </div>\n            <div class=\"resumen-item\">\n              <span><strong>\uD83D\uDCB0 Precio unitario:</strong></span>\n              <span>$" + precioUnitario.toFixed(2) + "</span>\n            </div>\n            <div class=\"resumen-item total\">\n              <span><strong>\uD83D\uDCB3 TOTAL PAGADO:</strong></span>\n              <span>$" + totalVenta.toFixed(2) + "</span>\n            </div>\n          </div>\n          \n          <div class=\"boletos-seccion\">\n            <div class=\"seccion-titulo\">\uD83C\uDFAB Boletos Generados (" + totalBoletos + ")</div>\n            <div class=\"boletos-grid\">\n    ";
                        console.log('🔄 Generando boletos, total:', this.boletosCreados.length);
                        i = 0;
                        _t.label = 1;
                    case 1:
                        if (!(i < this.boletosCreados.length)) return [3 /*break*/, 10];
                        boleto = this.boletosCreados[i];
                        console.log("\uD83C\uDFAB Procesando boleto " + (i + 1) + ":", {
                            id: boleto.id,
                            codigoQR: boleto.codigoQR,
                            codigoQRLength: (_h = boleto.codigoQR) === null || _h === void 0 ? void 0 : _h.length,
                            codigoQRType: typeof boleto.codigoQR
                        });
                        // Validar y limpiar el código QR
                        if (!boleto.codigoQR || boleto.codigoQR.trim() === '') {
                            console.error("\u274C C\u00F3digo QR vac\u00EDo para boleto " + (i + 1));
                            return [3 /*break*/, 9]; // Saltar este boleto
                        }
                        codigoQRLimpio = String(boleto.codigoQR).trim().replace(/[\r\n\t]/g, '');
                        console.log("\uD83E\uDDF9 C\u00F3digo QR limpio: \"" + codigoQRLimpio + "\"");
                        _t.label = 2;
                    case 2:
                        _t.trys.push([2, 8, , 9]);
                        // Generar código QR como Data URL
                        console.log("\uD83D\uDCF1 Generando QR para boleto " + (i + 1) + "...");
                        qrDataURL = void 0;
                        _t.label = 3;
                    case 3:
                        _t.trys.push([3, 5, , 7]);
                        return [4 /*yield*/, QRCode.toDataURL(codigoQRLimpio, {
                                width: 80,
                                margin: 1,
                                errorCorrectionLevel: 'M',
                                color: {
                                    dark: '#000000',
                                    light: '#FFFFFF'
                                }
                            })];
                    case 4:
                        // Intento con configuración completa (QR más pequeño para múltiples boletos)
                        qrDataURL = _t.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        qrFirstError_1 = _t.sent();
                        console.log("\u26A0\uFE0F Primer intento fall\u00F3:", qrFirstError_1);
                        console.log("\uD83D\uDD04 Probando configuraci\u00F3n b\u00E1sica...");
                        return [4 /*yield*/, QRCode.toDataURL(codigoQRLimpio)];
                    case 6:
                        // Intento con configuración básica
                        qrDataURL = _t.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        console.log("\u2705 QR generado exitosamente para boleto " + (i + 1));
                        asiento = boleto.asiento;
                        filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
                        numeroAsiento = asiento ? asiento.numero : 'N/A';
                        html += "\n              <div class=\"boleto-item\">\n                <div class=\"boleto-info\">\n                  <div class=\"boleto-numero\">Boleto #" + (i + 1) + "</div>\n                  \n                  <div class=\"pelicula-titulo\">" + (((_k = (_j = boleto.funcion) === null || _j === void 0 ? void 0 : _j.pelicula) === null || _k === void 0 ? void 0 : _k.titulo) || 'N/A') + "</div>\n                  \n                  <div class=\"funcion-detalles\">\n                    <div class=\"detalle-item\">\n                      <span class=\"detalle-label\">\uD83D\uDCC5 Fecha</span>\n                      <span class=\"detalle-valor\">" + this.formatearFecha(((_l = boleto.funcion) === null || _l === void 0 ? void 0 : _l.inicio) || '') + "</span>\n                    </div>\n                    <div class=\"detalle-item\">\n                      <span class=\"detalle-label\">\uD83D\uDD50 Hora</span>\n                      <span class=\"detalle-valor\">" + this.formatearHora(((_m = boleto.funcion) === null || _m === void 0 ? void 0 : _m.inicio) || '') + "</span>\n                    </div>\n                    <div class=\"detalle-item\">\n                      <span class=\"detalle-label\">\uD83C\uDFE2 Sala</span>\n                      <span class=\"detalle-valor\">" + (((_p = (_o = boleto.funcion) === null || _o === void 0 ? void 0 : _o.sala) === null || _p === void 0 ? void 0 : _p.nombre) || 'N/A') + "</span>\n                    </div>\n                    <div class=\"detalle-item\">\n                      <span class=\"detalle-label\">\u2705 Estado</span>\n                      <span class=\"detalle-valor\">" + boleto.estado + "</span>\n                    </div>\n                  </div>\n                  \n                  <div class=\"asiento-destacado\">\n                    \uD83E\uDE91 FILA " + filaLetra + " - ASIENTO " + numeroAsiento + "\n                  </div>\n                  \n                  <div class=\"precio-boleto\">\n                    \uD83D\uDCB0 $" + (((_q = boleto.funcion) === null || _q === void 0 ? void 0 : _q.precio) || '0.00') + "\n                  </div>\n                </div>\n                \n                <div class=\"boleto-qr-section\">\n                  <div class=\"qr-code\">\n                    <img src=\"" + qrDataURL + "\" alt=\"C\u00F3digo QR\" width=\"80\" height=\"80\" />\n                  </div>\n                  <div class=\"codigo-texto\">\n                    " + codigoQRLimpio + "\n                  </div>\n                </div>\n        ";
                        return [3 /*break*/, 9];
                    case 8:
                        qrError_1 = _t.sent();
                        console.error("\u274C Error generando QR para boleto " + (i + 1) + ":", {
                            boletoId: boleto.id,
                            error: qrError_1,
                            codigoQR: boleto.codigoQR,
                            errorMessage: qrError_1.message,
                            errorStack: qrError_1.stack
                        });
                        asiento = boleto.asiento;
                        filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
                        numeroAsiento = asiento ? asiento.numero : 'N/A';
                        html += "\n              <div class=\"boleto-item\">\n                <div class=\"boleto-info\">\n                  <div class=\"boleto-numero\">Boleto #" + (i + 1) + "</div>\n                  \n                  <div class=\"pelicula-titulo\">" + (((_s = (_r = boleto.funcion) === null || _r === void 0 ? void 0 : _r.pelicula) === null || _s === void 0 ? void 0 : _s.titulo) || 'N/A') + "</div>\n                  \n                  <div class=\"asiento-destacado\">\n                    \uD83E\uDE91 FILA " + filaLetra + " - ASIENTO " + numeroAsiento + "\n                  </div>\n                  \n                  <div style=\"color: red; font-weight: bold; text-align: center; padding: 20px;\">\n                    \u274C ERROR: No se pudo generar c\u00F3digo QR\n                  </div>\n                  <div style=\"font-size: 10px; text-align: center; word-break: break-all;\">\n                    C\u00F3digo: " + boleto.codigoQR + "\n                  </div>\n                </div>\n                \n                <div class=\"boleto-qr-section\">\n                  <div style=\"padding: 30px; border: 3px solid red; border-radius: 10px; color: red;\">\n                    <div style=\"font-weight: bold; margin-bottom: 10px;\">\u274C ERROR QR</div>\n                    <div style=\"font-size: 10px; word-break: break-all;\">\n                      " + codigoQRLimpio + "\n                    </div>\n                  </div>\n                </div>\n              </div>\n        ";
                        return [3 /*break*/, 9];
                    case 9:
                        i++;
                        return [3 /*break*/, 1];
                    case 10:
                        html += "\n            </div>\n          </div>\n          \n          <div class=\"recibo-footer\">\n            <div class=\"terminos\">\n              <strong>\uD83D\uDCCB T\u00E9rminos y Condiciones:</strong><br>\n              \u2022 Conserve estos boletos durante toda la funci\u00F3n<br>\n              \u2022 Los boletos son v\u00E1lidos \u00FAnicamente para la fecha y hora indicadas<br>\n              \u2022 No se permiten cambios ni devoluciones<br>\n              \u2022 Presente el c\u00F3digo QR al momento del ingreso<br>\n              \u2022 El acceso est\u00E1 sujeto a disponibilidad de asientos\n            </div>\n            \n            <div class=\"contacto\">\n              \uD83C\uDFAC CINE DIGITAL - Su experiencia cinematogr\u00E1fica \uD83C\uDFAC<br>\n              \uD83D\uDCDE Contacto: (555) 123-4567 | \uD83D\uDCE7 info@cinedigital.com\n            </div>\n          </div>\n        </div>\n      </body>\n      </html>\n    ";
                        console.log('🏁 HTML generado completamente, longitud total:', html.length);
                        return [2 /*return*/, html];
                }
            });
        });
    };
    VenderBoletosComponent.prototype.generarHTMLSimpleConQR = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, Promise, function () {
            var totalBoletos, precioUnitario, totalVenta, fechaVenta, html, i, boleto, asiento, filaLetra, numeroAsiento, codigoQRLimpio, qrDataURL, qrError_2;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        console.log('🔧 Generando HTML simple con códigos QR...');
                        totalBoletos = this.boletosCreados.length;
                        precioUnitario = ((_a = this.funcionSeleccionada) === null || _a === void 0 ? void 0 : _a.precio) || 0;
                        totalVenta = totalBoletos * precioUnitario;
                        fechaVenta = new Date();
                        html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"UTF-8\">\n        <title>Boletos - Cine Digital</title>\n        <style>\n          @page { size: A4; margin: 1cm; }\n          body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }\n          .header { text-align: center; margin-bottom: 15px; }\n          .boleto { \n            border: 2px solid #333; \n            margin: 10px 0; \n            padding: 10px; \n            display: flex; \n            height: 120px;\n            page-break-inside: avoid;\n          }\n          .info { flex: 1; font-size: 9px; }\n          .qr { text-align: center; width: 100px; }\n          .detail { margin: 3px 0; }\n          /* Permitir m\u00FAltiples boletos por p\u00E1gina */\n          .boleto:nth-child(4n+1) { page-break-before: auto; }\n          @media print { \n            body { font-size: 9px; }\n            .boleto { height: 110px; }\n            .qr img { width: 80px !important; height: 80px !important; }\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <h1>\uD83C\uDFAC CINE DIGITAL \uD83C\uDFAC</h1>\n          <h2>RECIBO DE VENTA</h2>\n          <p>Fecha: " + this.formatearFecha(fechaVenta.toISOString()) + " - " + this.formatearHora(fechaVenta.toISOString()) + "</p>\n          <p><strong>TOTAL: $" + totalVenta.toFixed(2) + "</strong></p>\n        </div>\n    ";
                        i = 0;
                        _m.label = 1;
                    case 1:
                        if (!(i < this.boletosCreados.length)) return [3 /*break*/, 6];
                        boleto = this.boletosCreados[i];
                        asiento = boleto.asiento;
                        filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
                        numeroAsiento = asiento ? asiento.numero : 'N/A';
                        codigoQRLimpio = String(boleto.codigoQR).trim();
                        _m.label = 2;
                    case 2:
                        _m.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, QRCode.toDataURL(codigoQRLimpio, {
                                width: 80,
                                margin: 1
                            })];
                    case 3:
                        qrDataURL = _m.sent();
                        html += "\n          <div class=\"boleto\">\n            <div class=\"info\">\n              <h3>Boleto #" + (i + 1) + "</h3>\n              <div class=\"detail\"><strong>Pel\u00EDcula:</strong> " + (((_c = (_b = boleto.funcion) === null || _b === void 0 ? void 0 : _b.pelicula) === null || _c === void 0 ? void 0 : _c.titulo) || 'N/A') + "</div>\n              <div class=\"detail\"><strong>Fecha:</strong> " + this.formatearFecha(((_d = boleto.funcion) === null || _d === void 0 ? void 0 : _d.inicio) || '') + "</div>\n              <div class=\"detail\"><strong>Hora:</strong> " + this.formatearHora(((_e = boleto.funcion) === null || _e === void 0 ? void 0 : _e.inicio) || '') + "</div>\n              <div class=\"detail\"><strong>Sala:</strong> " + (((_g = (_f = boleto.funcion) === null || _f === void 0 ? void 0 : _f.sala) === null || _g === void 0 ? void 0 : _g.nombre) || 'N/A') + "</div>\n              <div class=\"detail\"><strong>Asiento:</strong> Fila " + filaLetra + " - N\u00FAmero " + numeroAsiento + "</div>\n              <div class=\"detail\"><strong>Precio:</strong> $" + (((_h = boleto.funcion) === null || _h === void 0 ? void 0 : _h.precio) || '0.00') + "</div>\n            </div>\n            <div class=\"qr\">\n              <img src=\"" + qrDataURL + "\" width=\"80\" height=\"80\" alt=\"QR Code\" />\n              <div style=\"font-size: 8px; margin-top: 5px; word-break: break-all;\">" + codigoQRLimpio + "</div>\n            </div>\n          </div>\n        ";
                        return [3 /*break*/, 5];
                    case 4:
                        qrError_2 = _m.sent();
                        console.error('Error generando QR simple:', qrError_2);
                        html += "\n          <div class=\"boleto\">\n            <div class=\"info\">\n              <h3>Boleto #" + (i + 1) + "</h3>\n              <div class=\"detail\"><strong>Pel\u00EDcula:</strong> " + (((_k = (_j = boleto.funcion) === null || _j === void 0 ? void 0 : _j.pelicula) === null || _k === void 0 ? void 0 : _k.titulo) || 'N/A') + "</div>\n              <div class=\"detail\"><strong>Asiento:</strong> Fila " + filaLetra + " - N\u00FAmero " + numeroAsiento + "</div>\n              <div class=\"detail\"><strong>Precio:</strong> $" + (((_l = boleto.funcion) === null || _l === void 0 ? void 0 : _l.precio) || '0.00') + "</div>\n            </div>\n            <div class=\"qr\">\n              <div style=\"border: 2px solid red; padding: 20px; color: red;\">\n                ERROR QR<br>\n                <small>" + codigoQRLimpio + "</small>\n              </div>\n            </div>\n          </div>\n        ";
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        html += "</body></html>";
                        return [2 /*return*/, html];
                }
            });
        });
    };
    VenderBoletosComponent.prototype.generarHTMLSinQR = function () {
        var _this = this;
        var _a;
        console.log('🔧 Generando HTML básico sin códigos QR...');
        var totalBoletos = this.boletosCreados.length;
        var precioUnitario = ((_a = this.funcionSeleccionada) === null || _a === void 0 ? void 0 : _a.precio) || 0;
        var totalVenta = totalBoletos * precioUnitario;
        var fechaVenta = new Date();
        var html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"UTF-8\">\n        <title>Recibo de Venta - Cine Digital</title>\n        <style>\n          @page { size: A4; margin: 1cm; }\n          body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }\n          .header { text-align: center; margin-bottom: 15px; }\n          .boleto { \n            border: 2px solid #333; \n            margin: 10px 0; \n            padding: 15px; \n            page-break-inside: avoid;\n            height: auto;\n            min-height: 120px;\n          }\n          .info { margin: 5px 0; font-size: 9px; }\n          /* M\u00FAltiples boletos por p\u00E1gina */\n          .boleto:nth-child(4n+1) { page-break-before: auto; }\n          @media print { \n            body { font-size: 9px; }\n            .boleto { min-height: 110px; }\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <h1>\uD83C\uDFAC CINE DIGITAL \uD83C\uDFAC</h1>\n          <h2>RECIBO DE VENTA</h2>\n          <p>Fecha: " + this.formatearFecha(fechaVenta.toISOString()) + " - " + this.formatearHora(fechaVenta.toISOString()) + "</p>\n          <p><strong>TOTAL: $" + totalVenta.toFixed(2) + "</strong></p>\n        </div>\n    ";
        this.boletosCreados.forEach(function (boleto, i) {
            var _a, _b, _c, _d, _e, _f, _g;
            var asiento = boleto.asiento;
            var filaLetra = asiento ? String.fromCharCode(64 + asiento.fila) : 'N/A';
            var numeroAsiento = asiento ? asiento.numero : 'N/A';
            html += "\n        <div class=\"boleto\">\n          <h3>Boleto #" + (i + 1) + "</h3>\n          <div class=\"info\"><strong>Pel\u00EDcula:</strong> " + (((_b = (_a = boleto.funcion) === null || _a === void 0 ? void 0 : _a.pelicula) === null || _b === void 0 ? void 0 : _b.titulo) || 'N/A') + "</div>\n          <div class=\"info\"><strong>Fecha:</strong> " + _this.formatearFecha(((_c = boleto.funcion) === null || _c === void 0 ? void 0 : _c.inicio) || '') + "</div>\n          <div class=\"info\"><strong>Hora:</strong> " + _this.formatearHora(((_d = boleto.funcion) === null || _d === void 0 ? void 0 : _d.inicio) || '') + "</div>\n          <div class=\"info\"><strong>Sala:</strong> " + (((_f = (_e = boleto.funcion) === null || _e === void 0 ? void 0 : _e.sala) === null || _f === void 0 ? void 0 : _f.nombre) || 'N/A') + "</div>\n          <div class=\"info\"><strong>Asiento:</strong> Fila " + filaLetra + " - N\u00FAmero " + numeroAsiento + "</div>\n          <div class=\"info\"><strong>Precio:</strong> $" + (((_g = boleto.funcion) === null || _g === void 0 ? void 0 : _g.precio) || '0.00') + "</div>\n          <div class=\"info\"><strong>C\u00F3digo:</strong> " + boleto.codigoQR + "</div>\n        </div>\n      ";
        });
        html += "\n      </body>\n      </html>\n    ";
        return html;
    };
    VenderBoletosComponent.prototype.imprimirDirectamente = function (htmlContent) {
        var _a;
        // Crear un iframe oculto para impresión
        var iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
        // Escribir contenido y preparar para impresión
        var doc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
        if (doc) {
            doc.open();
            doc.write(htmlContent);
            doc.close();
            // Esperar a que cargue y luego imprimir
            iframe.onload = function () {
                setTimeout(function () {
                    var _a;
                    (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.print();
                    // Remover el iframe después de imprimir
                    setTimeout(function () {
                        document.body.removeChild(iframe);
                    }, 1000);
                }, 500);
            };
        }
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
