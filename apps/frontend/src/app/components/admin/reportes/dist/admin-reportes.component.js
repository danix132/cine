"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminReportesComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var XLSX = require("xlsx");
var AdminReportesComponent = /** @class */ (function () {
    function AdminReportesComponent(fb, reportesService, authService, router) {
        this.fb = fb;
        this.reportesService = reportesService;
        this.authService = authService;
        this.router = router;
        this.reporteActual = '';
        this.cargando = false;
        this.error = '';
        this.tienePermisos = false;
        this.mensajeError = '';
        // Datos de reportes
        this.reporteVentas = null;
        this.reporteOcupacion = null;
        this.reporteTopPeliculas = null;
        this.reporteVentasPorVendedor = null;
        this.reporteVentasDulceria = null;
        this.reporteForm = this.fb.group({
            desde: ['', forms_1.Validators.required],
            hasta: ['', forms_1.Validators.required],
            tipoReporte: ['ventas', forms_1.Validators.required],
            limite: [10]
        });
        // Establecer fechas por defecto (último mes)
        var hoy = new Date();
        var hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);
        console.log('📅 FRONTEND: Configurando fechas por defecto:', {
            hoy: hoy,
            hace30Dias: hace30Dias,
            hoySolo: hoy.toISOString().split('T')[0],
            hace30DiasSolo: hace30Dias.toISOString().split('T')[0]
        });
        this.reporteForm.patchValue({
            desde: hace30Dias.toISOString().split('T')[0],
            hasta: hoy.toISOString().split('T')[0]
        });
    }
    AdminReportesComponent.prototype.ngOnInit = function () {
        this.verificarPermisos();
    };
    AdminReportesComponent.prototype.verificarPermisos = function () {
        var usuario = this.authService.getCurrentUser();
        if (!usuario || usuario.rol !== 'ADMIN') {
            this.tienePermisos = false;
            this.mensajeError = 'No tienes permisos para acceder a esta sección. Solo los administradores pueden ver reportes.';
        }
        else {
            this.tienePermisos = true;
        }
    };
    AdminReportesComponent.prototype.volverAlInicio = function () {
        this.router.navigate(['/']);
    };
    AdminReportesComponent.prototype.volverAlAdmin = function () {
        this.router.navigate(['/admin']);
    };
    AdminReportesComponent.prototype.generarReporte = function () {
        if (!this.reporteForm.valid) {
            this.error = 'Por favor completa todos los campos requeridos';
            return;
        }
        var formData = this.reporteForm.value;
        this.reporteActual = formData.tipoReporte;
        this.cargando = true;
        this.error = '';
        // Limpiar reportes anteriores
        this.limpiarReportes();
        switch (formData.tipoReporte) {
            case 'ventas':
                this.generarReporteVentas(formData.desde, formData.hasta);
                break;
            case 'ocupacion':
                this.generarReporteOcupacion(formData.desde, formData.hasta);
                break;
            case 'top-peliculas':
                this.generarReporteTopPeliculas(formData.desde, formData.hasta, formData.limite);
                break;
            case 'ventas-por-vendedor':
                this.generarReporteVentasPorVendedor(formData.desde, formData.hasta);
                break;
            case 'ventas-dulceria':
                this.generarReporteVentasDulceria(formData.desde, formData.hasta);
                break;
            default:
                this.error = 'Tipo de reporte no válido';
                this.cargando = false;
        }
    };
    AdminReportesComponent.prototype.limpiarReportes = function () {
        this.reporteVentas = null;
        this.reporteOcupacion = null;
        this.reporteTopPeliculas = null;
        this.reporteVentasPorVendedor = null;
        this.reporteVentasDulceria = null;
    };
    AdminReportesComponent.prototype.generarReporteVentas = function (desde, hasta) {
        var _this = this;
        console.log('🔍 FRONTEND: Generando reporte de ventas con fechas:', { desde: desde, hasta: hasta });
        console.log('📅 FRONTEND: Fecha actual del navegador:', new Date());
        this.reportesService.getReporteVentas(desde, hasta).subscribe({
            next: function (data) {
                console.log('✅ FRONTEND: Reporte de ventas recibido:', data);
                _this.reporteVentas = data;
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error generando reporte de ventas:', error);
                _this.error = 'Error al generar el reporte de ventas';
                _this.cargando = false;
            }
        });
    };
    AdminReportesComponent.prototype.generarReporteOcupacion = function (desde, hasta) {
        var _this = this;
        this.reportesService.getReporteOcupacion(desde, hasta).subscribe({
            next: function (data) {
                _this.reporteOcupacion = data;
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error generando reporte de ocupación:', error);
                _this.error = 'Error al generar el reporte de ocupación';
                _this.cargando = false;
            }
        });
    };
    AdminReportesComponent.prototype.generarReporteTopPeliculas = function (desde, hasta, limite) {
        var _this = this;
        this.reportesService.getReporteTopPeliculas(desde, hasta, limite).subscribe({
            next: function (data) {
                _this.reporteTopPeliculas = data;
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error generando reporte de top películas:', error);
                _this.error = 'Error al generar el reporte de top películas';
                _this.cargando = false;
            }
        });
    };
    AdminReportesComponent.prototype.generarReporteVentasPorVendedor = function (desde, hasta) {
        var _this = this;
        this.reportesService.getReporteVentasPorVendedor(desde, hasta).subscribe({
            next: function (data) {
                _this.reporteVentasPorVendedor = data;
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error generando reporte de ventas por vendedor:', error);
                _this.error = 'Error al generar el reporte de ventas por vendedor';
                _this.cargando = false;
            }
        });
    };
    AdminReportesComponent.prototype.generarReporteVentasDulceria = function (desde, hasta) {
        var _this = this;
        this.reportesService.getReporteVentasDulceria(desde, hasta).subscribe({
            next: function (data) {
                _this.reporteVentasDulceria = data;
                _this.cargando = false;
            },
            error: function (error) {
                console.error('Error generando reporte de ventas de dulcería:', error);
                _this.error = 'Error al generar el reporte de ventas de dulcería';
                _this.cargando = false;
            }
        });
    };
    AdminReportesComponent.prototype.formatearFecha = function (fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    AdminReportesComponent.prototype.formatearMoneda = function (valor) {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU'
        }).format(valor);
    };
    AdminReportesComponent.prototype.exportarExcel = function () {
        if (!this.reporteActual)
            return;
        var data = [];
        var filename = '';
        var sheetName = '';
        switch (this.reporteActual) {
            case 'ventas':
                if (this.reporteVentas) {
                    data = this.generarDatosVentas();
                    filename = 'reporte-ventas.xlsx';
                    sheetName = 'Ventas';
                }
                break;
            case 'ocupacion':
                if (this.reporteOcupacion) {
                    data = this.generarDatosOcupacion();
                    filename = 'reporte-ocupacion.xlsx';
                    sheetName = 'Ocupación';
                }
                break;
            case 'top-peliculas':
                if (this.reporteTopPeliculas) {
                    data = this.generarDatosTopPeliculas();
                    filename = 'reporte-top-peliculas.xlsx';
                    sheetName = 'Top Películas';
                }
                break;
            case 'ventas-por-vendedor':
                if (this.reporteVentasPorVendedor) {
                    data = this.generarDatosVentasPorVendedor();
                    filename = 'reporte-ventas-por-vendedor.xlsx';
                    sheetName = 'Ventas por Vendedor';
                }
                break;
            case 'ventas-dulceria':
                if (this.reporteVentasDulceria) {
                    data = this.generarDatosVentasDulceria();
                    filename = 'reporte-ventas-dulceria.xlsx';
                    sheetName = 'Ventas Dulcería';
                }
                break;
        }
        if (data.length > 0) {
            this.descargarExcel(data, filename, sheetName);
        }
    };
    AdminReportesComponent.prototype.generarDatosVentas = function () {
        var _this = this;
        if (!this.reporteVentas)
            return [];
        var datos = [
            // Header con información del reporte
            ['REPORTE DE VENTAS'],
            ["Per\u00EDodo: " + this.formatearFecha(this.reporteVentas.periodo.desde) + " - " + this.formatearFecha(this.reporteVentas.periodo.hasta)],
            ["Total de Ventas: " + this.formatearMoneda(this.reporteVentas.totalVentas)],
            ["Cantidad de Pedidos: " + this.reporteVentas.cantidadPedidos],
            ["Promedio por Pedido: " + this.formatearMoneda(this.reporteVentas.totalVentas / this.reporteVentas.cantidadPedidos)],
            [],
            // Headers de la tabla
            ['Fecha', 'Cliente', 'Vendedor', 'Total']
        ];
        // Agregar los datos
        this.reporteVentas.ventas.forEach(function (venta) {
            var _a, _b;
            datos.push([
                _this.formatearFecha(venta.createdAt),
                ((_a = venta.usuario) === null || _a === void 0 ? void 0 : _a.nombre) || 'N/A',
                ((_b = venta.vendedor) === null || _b === void 0 ? void 0 : _b.nombre) || 'Sin vendedor',
                venta.total
            ]);
        });
        return datos;
    };
    AdminReportesComponent.prototype.generarDatosOcupacion = function () {
        var _this = this;
        if (!this.reporteOcupacion)
            return [];
        var datos = [
            ['REPORTE DE OCUPACIÓN DE SALAS'],
            ["Per\u00EDodo: " + this.formatearFecha(this.reporteOcupacion.periodo.desde) + " - " + this.formatearFecha(this.reporteOcupacion.periodo.hasta)],
            ["Total de Funciones: " + this.reporteOcupacion.totalFunciones],
            ["Ocupaci\u00F3n Promedio: " + this.calcularPromedioOcupacion() + "%"],
            [],
            ['Película', 'Sala', 'Fecha', 'Total Asientos', 'Asientos Ocupados', '% Ocupación']
        ];
        this.reporteOcupacion.ocupacionPorFuncion.forEach(function (funcion) {
            datos.push([
                funcion.pelicula,
                funcion.sala,
                _this.formatearFecha(funcion.inicio),
                funcion.totalAsientos,
                funcion.asientosOcupados,
                funcion.porcentajeOcupacion + "%"
            ]);
        });
        return datos;
    };
    AdminReportesComponent.prototype.generarDatosTopPeliculas = function () {
        if (!this.reporteTopPeliculas)
            return [];
        var datos = [
            ['TOP PELÍCULAS MÁS POPULARES'],
            ["Per\u00EDodo: " + this.formatearFecha(this.reporteTopPeliculas.periodo.desde) + " - " + this.formatearFecha(this.reporteTopPeliculas.periodo.hasta)],
            ["Pel\u00EDculas con Ventas: " + this.reporteTopPeliculas.topPeliculas.length],
            [],
            ['Ranking', 'Película', 'Total Boletos', 'Total Funciones', 'Promedio por Función']
        ];
        this.reporteTopPeliculas.topPeliculas.forEach(function (pelicula, index) {
            datos.push([
                index + 1,
                pelicula.titulo,
                pelicula.totalBoletos,
                pelicula.totalFunciones,
                parseFloat(pelicula.promedioBoletosPorFuncion.toFixed(1))
            ]);
        });
        return datos;
    };
    AdminReportesComponent.prototype.generarDatosVentasPorVendedor = function () {
        if (!this.reporteVentasPorVendedor)
            return [];
        var datos = [
            ['REPORTE DE VENTAS POR VENDEDOR'],
            ["Per\u00EDodo: " + this.formatearFecha(this.reporteVentasPorVendedor.periodo.desde) + " - " + this.formatearFecha(this.reporteVentasPorVendedor.periodo.hasta)],
            ["Vendedores Activos: " + this.reporteVentasPorVendedor.ventasPorVendedor.length],
            ["Total Vendido: " + this.formatearMoneda(this.calcularTotalVentasVendedores())],
            [],
            ['Ranking', 'Vendedor', 'Email', 'Total Ventas', 'Cantidad Pedidos', 'Promedio por Pedido']
        ];
        this.reporteVentasPorVendedor.ventasPorVendedor.forEach(function (vendedor, index) {
            datos.push([
                index + 1,
                vendedor.nombre,
                vendedor.email,
                vendedor.totalVentas,
                vendedor.cantidadPedidos,
                parseFloat((vendedor.totalVentas / vendedor.cantidadPedidos).toFixed(2))
            ]);
        });
        return datos;
    };
    AdminReportesComponent.prototype.descargarExcel = function (data, filename, sheetName) {
        // Crear un nuevo workbook
        var workbook = XLSX.utils.book_new();
        // Crear worksheet con los datos
        var worksheet = XLSX.utils.aoa_to_sheet(data);
        // Aplicar estilos básicos
        var range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        // Ajustar ancho de columnas
        var colWidths = [];
        for (var col = range.s.c; col <= range.e.c; col++) {
            var maxWidth = 10;
            for (var row = range.s.r; row <= range.e.r; row++) {
                var cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                var cell = worksheet[cellAddress];
                if (cell && cell.v) {
                    var cellLength = cell.v.toString().length;
                    if (cellLength > maxWidth) {
                        maxWidth = cellLength;
                    }
                }
            }
            colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
        }
        worksheet['!cols'] = colWidths;
        // Añadir worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        // Generar el archivo y descargarlo
        XLSX.writeFile(workbook, filename);
    };
    AdminReportesComponent.prototype.calcularPromedioOcupacion = function () {
        if (!this.reporteOcupacion || this.reporteOcupacion.ocupacionPorFuncion.length === 0) {
            return 0;
        }
        var sumaOcupacion = this.reporteOcupacion.ocupacionPorFuncion.reduce(function (suma, funcion) { return suma + funcion.porcentajeOcupacion; }, 0);
        return Math.round((sumaOcupacion / this.reporteOcupacion.ocupacionPorFuncion.length) * 100) / 100;
    };
    AdminReportesComponent.prototype.calcularTotalVentasVendedores = function () {
        if (!this.reporteVentasPorVendedor) {
            return 0;
        }
        return this.reporteVentasPorVendedor.ventasPorVendedor.reduce(function (total, vendedor) { return total + vendedor.totalVentas; }, 0);
    };
    AdminReportesComponent.prototype.generarDatosVentasDulceria = function () {
        var _this = this;
        if (!this.reporteVentasDulceria)
            return [];
        var datos = [
            ['REPORTE DE VENTAS DE DULCERÍA'],
            ["Per\u00EDodo: " + this.formatearFecha(this.reporteVentasDulceria.periodo.desde) + " - " + this.formatearFecha(this.reporteVentasDulceria.periodo.hasta)],
            ["Total Ventas: " + this.formatearMoneda(this.reporteVentasDulceria.totalVentas)],
            ["Total Productos Vendidos: " + this.reporteVentasDulceria.totalProductosVendidos],
            [],
            ['VENTAS POR PRODUCTO'],
            ['Producto', 'Tipo', 'Cantidad Vendida', 'Total Ventas']
        ];
        this.reporteVentasDulceria.ventasPorProducto.forEach(function (producto) {
            datos.push([
                producto.nombre,
                producto.tipo,
                producto.cantidadVendida,
                producto.totalVentas
            ]);
        });
        datos.push([]);
        datos.push(['VENTAS POR DÍA']);
        datos.push(['Fecha', 'Cantidad Productos', 'Total Ventas']);
        this.reporteVentasDulceria.ventasPorDia.forEach(function (dia) {
            datos.push([
                _this.formatearFecha(dia.fecha),
                dia.cantidadProductos,
                dia.totalVentas
            ]);
        });
        return datos;
    };
    AdminReportesComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-reportes',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, router_1.RouterModule],
            templateUrl: './admin-reportes.component.html',
            styleUrls: ['./admin-reportes.component.scss']
        })
    ], AdminReportesComponent);
    return AdminReportesComponent;
}());
exports.AdminReportesComponent = AdminReportesComponent;
