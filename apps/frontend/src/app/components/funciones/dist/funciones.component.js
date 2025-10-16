"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FuncionesComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var FuncionesComponent = /** @class */ (function () {
    function FuncionesComponent(funcionesService, router) {
        this.funcionesService = funcionesService;
        this.router = router;
        this.funciones = [];
        this.isLoading = true;
        this.errorMessage = '';
    }
    FuncionesComponent.prototype.ngOnInit = function () {
        this.loadFunciones();
    };
    FuncionesComponent.prototype.loadFunciones = function () {
        var _this = this;
        this.isLoading = true;
        this.funcionesService.getFuncionesDisponibles().subscribe({
            next: function (funciones) {
                _this.funciones = funciones;
                _this.isLoading = false;
            },
            error: function (error) {
                _this.errorMessage = 'Error al cargar las funciones';
                _this.isLoading = false;
                console.error('Error loading funciones:', error);
            }
        });
    };
    FuncionesComponent.prototype.seleccionarAsientos = function (funcion) {
        this.router.navigate(['/seleccion-asientos', funcion.id]);
    };
    FuncionesComponent.prototype.getFormattedDate = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    FuncionesComponent.prototype.getFormattedTime = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    FuncionesComponent.prototype.onImageError = function (event) {
        var target = event.target;
        if (target) {
            target.src = '/assets/images/default-poster.svg';
        }
    };
    FuncionesComponent = __decorate([
        core_1.Component({
            selector: 'app-funciones',
            standalone: true,
            imports: [common_1.CommonModule],
            templateUrl: './funciones.component.html',
            styleUrls: ['./funciones.component.scss']
        })
    ], FuncionesComponent);
    return FuncionesComponent;
}());
exports.FuncionesComponent = FuncionesComponent;
