"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MisVentasComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../../environments/environment");
var MisVentasComponent = /** @class */ (function () {
    function MisVentasComponent(router, http, authService) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.cargandoVentas = false;
        this.misVentas = null;
        this.desglose = null;
        this.filtroTipo = 'TODOS';
        this.periodo = {
            desde: '',
            hasta: ''
        };
        // Establecer período por defecto (últimos 30 días)
        var hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        this.periodo.desde = hace30Dias.toISOString().split('T')[0];
        this.periodo.hasta = new Date().toISOString().split('T')[0];
    }
    MisVentasComponent.prototype.ngOnInit = function () {
        this.cargarMisVentas();
        this.cargarDesglose();
    };
    MisVentasComponent.prototype.cargarMisVentas = function () {
        var _this = this;
        this.cargandoVentas = true;
        var currentUser = this.authService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
            console.error('Usuario no autenticado');
            this.cargandoVentas = false;
            return;
        }
        // Obtener token de autenticación
        var token = this.authService.getToken();
        if (!token) {
            console.error('No hay token de autenticación');
            this.cargandoVentas = false;
            return;
        }
        // Construir URL con parámetros
        var url = environment_1.environment.apiUrl + "/reportes/mis-ventas/" + currentUser.id;
        var params = [];
        if (this.periodo.desde) {
            params.push("desde=" + this.periodo.desde);
        }
        if (this.periodo.hasta) {
            params.push("hasta=" + this.periodo.hasta);
        }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        // Crear headers con el token de autenticación
        var headers = {
            'Authorization': "Bearer " + token
        };
        this.http.get(url, { headers: headers }).subscribe({
            next: function (reporte) {
                console.log('📊 Reporte de mis ventas:', reporte);
                // Buscar los datos del vendedor actual
                _this.misVentas = reporte.ventasPorVendedor.find(function (v) { return v.vendedorId === currentUser.id; }) || {
                    vendedorId: currentUser.id,
                    nombre: currentUser.nombre || 'N/A',
                    email: currentUser.email || 'N/A',
                    totalVentas: 0,
                    cantidadPedidos: 0
                };
                _this.cargandoVentas = false;
            },
            error: function (error) {
                console.error('Error al cargar mis ventas:', error);
                _this.cargandoVentas = false;
                _this.misVentas = null;
            }
        });
    };
    MisVentasComponent.prototype.cargarDesglose = function () {
        var _this = this;
        var currentUser = this.authService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
            console.error('Usuario no autenticado');
            return;
        }
        var token = this.authService.getToken();
        if (!token) {
            console.error('No hay token de autenticación');
            return;
        }
        // Construir URL con parámetros
        var url = environment_1.environment.apiUrl + "/reportes/mis-ventas/" + currentUser.id + "/desglose";
        var params = [];
        if (this.periodo.desde) {
            params.push("desde=" + this.periodo.desde);
        }
        if (this.periodo.hasta) {
            params.push("hasta=" + this.periodo.hasta);
        }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        var headers = {
            'Authorization': "Bearer " + token
        };
        this.http.get(url, { headers: headers }).subscribe({
            next: function (resultado) {
                console.log('📊 Desglose por tipo:', resultado);
                _this.desglose = resultado.desglose;
            },
            error: function (error) {
                console.error('Error al cargar desglose:', error);
                _this.desglose = null;
            }
        });
    };
    MisVentasComponent.prototype.limpiarFiltros = function () {
        // Restablecer a los valores por defecto (últimos 30 días)
        var hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        this.periodo.desde = hace30Dias.toISOString().split('T')[0];
        this.periodo.hasta = new Date().toISOString().split('T')[0];
        this.filtroTipo = 'TODOS';
        // Recargar con filtros limpios
        this.cargarMisVentas();
        this.cargarDesglose();
    };
    MisVentasComponent.prototype.volver = function () {
        this.router.navigate(['/vendedor']);
    };
    MisVentasComponent = __decorate([
        core_1.Component({
            selector: 'app-mis-ventas',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, http_1.HttpClientModule],
            templateUrl: './mis-ventas.component.html',
            styleUrls: ['./mis-ventas.component.scss']
        })
    ], MisVentasComponent);
    return MisVentasComponent;
}());
exports.MisVentasComponent = MisVentasComponent;
