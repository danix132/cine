"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SeleccionAsientosComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var sala_model_1 = require("../../models/sala.model");
var SeleccionAsientosComponent = /** @class */ (function () {
    function SeleccionAsientosComponent(route, router, salasService, boletosService, funcionesService) {
        this.route = route;
        this.router = router;
        this.salasService = salasService;
        this.boletosService = boletosService;
        this.funcionesService = funcionesService;
        this.sala = null;
        this.asientos = [];
        this.asientosSeleccionados = [];
        this.asientosOcupados = [];
        this.asientosDanados = [];
        this.isLoading = true;
        this.errorMessage = '';
    }
    SeleccionAsientosComponent.prototype.ngOnInit = function () {
        // Si no se pasó la función como input, cargarla desde la ruta
        if (!this.funcion) {
            var funcionId = this.route.snapshot.paramMap.get('funcionId');
            if (funcionId) {
                this.loadFuncion(funcionId);
            }
            else {
                this.errorMessage = 'ID de función no válido';
                this.isLoading = false;
            }
        }
        else {
            this.loadSala();
            this.loadAsientosOcupados();
        }
    };
    SeleccionAsientosComponent.prototype.loadFuncion = function (funcionId) {
        var _this = this;
        this.funcionesService.getFuncion(funcionId).subscribe({
            next: function (funcion) {
                _this.funcion = funcion;
                _this.loadSala();
                _this.loadAsientosOcupados();
            },
            error: function (error) {
                _this.errorMessage = 'Error al cargar la función';
                _this.isLoading = false;
                console.error('Error loading funcion:', error);
            }
        });
    };
    SeleccionAsientosComponent.prototype.loadSala = function () {
        var _this = this;
        if (this.funcion && this.funcion.salaId) {
            this.salasService.getSala(this.funcion.salaId).subscribe({
                next: function (sala) {
                    var _a;
                    _this.sala = sala;
                    // Usar los asientos reales de la sala si existen
                    if (sala.asientos && sala.asientos.length > 0) {
                        _this.asientos = sala.asientos;
                        console.log('Asientos de la sala cargados:', _this.asientos.length);
                        console.log('Primer asiento ID:', (_a = _this.asientos[0]) === null || _a === void 0 ? void 0 : _a.id);
                        // Cargar asientos dañados
                        _this.asientosDanados = sala.asientos
                            .filter(function (asiento) { return asiento.estado === sala_model_1.AsientoEstado.DANADO; })
                            .map(function (asiento) { return asiento.id; });
                        console.log('Asientos dañados:', _this.asientosDanados);
                    }
                    else {
                        // Si no hay asientos en la sala, generarlos (fallback)
                        console.log('Generando asientos (sala sin asientos)');
                        _this.generateAsientos();
                    }
                    _this.isLoading = false;
                },
                error: function (error) {
                    _this.errorMessage = 'Error al cargar la sala';
                    _this.isLoading = false;
                    console.error('Error loading sala:', error);
                }
            });
        }
    };
    SeleccionAsientosComponent.prototype.loadAsientosOcupados = function () {
        var _this = this;
        if (this.funcion && this.funcion.id) {
            this.boletosService.getBoletosPorFuncion(this.funcion.id).subscribe({
                next: function (boletos) {
                    console.log('📋 Boletos recibidos del backend:', boletos);
                    console.log('📊 Total boletos:', boletos.length);
                    var boletosActivos = boletos.filter(function (boleto) {
                        return boleto.estado === 'PAGADO' || boleto.estado === 'RESERVADO';
                    });
                    _this.asientosOcupados = boletosActivos.map(function (boleto) { return boleto.asientoId; });
                    console.log('✅ Boletos activos (PAGADO/RESERVADO):', boletosActivos.length);
                    console.log('🪑 Asientos ocupados (IDs):', _this.asientosOcupados);
                    console.log('🔍 Ejemplo de boleto:', boletos[0]);
                },
                error: function (error) {
                    console.error('❌ Error loading asientos ocupados:', error);
                }
            });
        }
    };
    SeleccionAsientosComponent.prototype.generateAsientos = function () {
        if (!this.sala)
            return;
        this.asientos = [];
        for (var fila = 1; fila <= this.sala.filas; fila++) {
            for (var numero = 1; numero <= this.sala.asientosPorFila; numero++) {
                this.asientos.push({
                    id: fila + "-" + numero,
                    salaId: this.sala.id,
                    fila: fila,
                    numero: numero,
                    estado: sala_model_1.AsientoEstado.DISPONIBLE
                });
            }
        }
    };
    SeleccionAsientosComponent.prototype.toggleAsiento = function (asientoId) {
        if (this.isAsientoOcupado(asientoId) || this.isAsientoDanado(asientoId))
            return;
        var index = this.asientosSeleccionados.indexOf(asientoId);
        if (index > -1) {
            this.asientosSeleccionados.splice(index, 1);
        }
        else {
            this.asientosSeleccionados.push(asientoId);
        }
    };
    SeleccionAsientosComponent.prototype.isAsientoSeleccionado = function (asientoId) {
        return this.asientosSeleccionados.includes(asientoId);
    };
    SeleccionAsientosComponent.prototype.isAsientoOcupado = function (asientoId) {
        return this.asientosOcupados.includes(asientoId);
    };
    SeleccionAsientosComponent.prototype.isAsientoDanado = function (asientoId) {
        return this.asientosDanados.includes(asientoId);
    };
    SeleccionAsientosComponent.prototype.getAsientosPorFila = function (fila) {
        return this.asientos.filter(function (asiento) { return asiento.fila === fila; });
    };
    SeleccionAsientosComponent.prototype.getFilas = function () {
        if (!this.sala)
            return [];
        return Array.from({ length: this.sala.filas }, function (_, i) { return i + 1; });
    };
    SeleccionAsientosComponent.prototype.getTotalSeleccionado = function () {
        return this.asientosSeleccionados.length;
    };
    SeleccionAsientosComponent.prototype.getPrecioTotal = function () {
        if (!this.funcion)
            return 0;
        return this.getTotalSeleccionado() * this.funcion.precio;
    };
    SeleccionAsientosComponent.prototype.continuarCompra = function () {
        // Implementar lógica de compra
        console.log('Asientos seleccionados:', this.asientosSeleccionados);
        console.log('Precio total:', this.getPrecioTotal());
    };
    SeleccionAsientosComponent.prototype.volver = function () {
        this.router.navigate(['/funciones']);
    };
    SeleccionAsientosComponent.prototype.getAsientoClass = function (asiento) {
        if (this.isAsientoDanado(asiento.id)) {
            return 'asiento danado';
        }
        else if (this.isAsientoOcupado(asiento.id)) {
            return 'asiento ocupado';
        }
        else if (this.isAsientoSeleccionado(asiento.id)) {
            return 'asiento seleccionado';
        }
        else {
            return 'asiento disponible';
        }
    };
    __decorate([
        core_1.Input()
    ], SeleccionAsientosComponent.prototype, "funcion");
    SeleccionAsientosComponent = __decorate([
        core_1.Component({
            selector: 'app-seleccion-asientos',
            standalone: true,
            imports: [common_1.CommonModule],
            templateUrl: './seleccion-asientos.component.html',
            styleUrls: ['./seleccion-asientos.component.scss']
        })
    ], SeleccionAsientosComponent);
    return SeleccionAsientosComponent;
}());
exports.SeleccionAsientosComponent = SeleccionAsientosComponent;
