"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PedidoConfirmadoComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var PedidoConfirmadoComponent = /** @class */ (function () {
    function PedidoConfirmadoComponent(route, router, pedidosService) {
        this.route = route;
        this.router = router;
        this.pedidosService = pedidosService;
        this.pedido = null;
        this.loading = true;
        this.error = '';
    }
    PedidoConfirmadoComponent.prototype.ngOnInit = function () {
        var pedidoId = this.route.snapshot.paramMap.get('id');
        if (pedidoId) {
            this.cargarPedido(pedidoId);
        }
        else {
            this.error = 'No se encontró el ID del pedido';
            this.loading = false;
        }
    };
    PedidoConfirmadoComponent.prototype.cargarPedido = function (id) {
        var _this = this;
        this.pedidosService.getPedido(id).subscribe({
            next: function (pedido) {
                _this.pedido = pedido;
                _this.loading = false;
            },
            error: function (error) {
                console.error('Error al cargar pedido:', error);
                _this.error = 'Error al cargar la información del pedido';
                _this.loading = false;
            }
        });
    };
    PedidoConfirmadoComponent.prototype.volverAlInicio = function () {
        this.router.navigate(['/peliculas']);
    };
    PedidoConfirmadoComponent.prototype.verMisPedidos = function () {
        this.router.navigate(['/cliente']);
    };
    PedidoConfirmadoComponent = __decorate([
        core_1.Component({
            selector: 'app-pedido-confirmado',
            standalone: true,
            imports: [common_1.CommonModule],
            templateUrl: './pedido-confirmado.component.html',
            styleUrl: './pedido-confirmado.component.scss'
        })
    ], PedidoConfirmadoComponent);
    return PedidoConfirmadoComponent;
}());
exports.PedidoConfirmadoComponent = PedidoConfirmadoComponent;
