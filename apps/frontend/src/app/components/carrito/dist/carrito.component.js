"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CarritoComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var CarritoComponent = /** @class */ (function () {
    function CarritoComponent(carritosService) {
        this.carritosService = carritosService;
        this.carrito = null;
        this.isLoading = true;
        this.errorMessage = '';
    }
    CarritoComponent.prototype.ngOnInit = function () {
        this.loadCarrito();
    };
    CarritoComponent.prototype.loadCarrito = function () {
        this.isLoading = true;
        // Implementar lógica para cargar carrito activo
        this.isLoading = false;
    };
    CarritoComponent.prototype.getTotal = function () {
        var _a;
        if (!((_a = this.carrito) === null || _a === void 0 ? void 0 : _a.items))
            return 0;
        return this.carrito.items.reduce(function (total, item) { return total + (item.precioUnitario * item.cantidad); }, 0);
    };
    CarritoComponent = __decorate([
        core_1.Component({
            selector: 'app-carrito',
            standalone: true,
            imports: [common_1.CommonModule],
            templateUrl: './carrito.component.html',
            styleUrls: ['./carrito.component.scss']
        })
    ], CarritoComponent);
    return CarritoComponent;
}());
exports.CarritoComponent = CarritoComponent;
