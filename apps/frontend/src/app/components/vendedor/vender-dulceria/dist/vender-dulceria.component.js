"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VenderDulceriaComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var dulceria_model_1 = require("../../../models/dulceria.model");
var VenderDulceriaComponent = /** @class */ (function () {
    function VenderDulceriaComponent(dulceriaService, authService, router) {
        this.dulceriaService = dulceriaService;
        this.authService = authService;
        this.router = router;
        this.items = [];
        this.itemsFiltrados = [];
        this.carrito = new Map();
        // Estados
        this.loading = false;
        this.procesandoVenta = false;
        // Modales
        this.mostrarModalConfirmacion = false;
        this.mostrarModalExito = false;
        // Filtros
        this.filtroBusqueda = '';
        this.filtroTipo = '';
        // Totales
        this.totalVenta = 0;
        this.cantidadTotal = 0;
        // Enums para el template
        this.DulceriaItemTipo = dulceria_model_1.DulceriaItemTipo;
        // Datos de venta exitosa
        this.ventaExitosa = null;
    }
    VenderDulceriaComponent.prototype.ngOnInit = function () {
        this.cargarItems();
    };
    VenderDulceriaComponent.prototype.cargarItems = function () {
        var _this = this;
        this.loading = true;
        console.log('🍿 Cargando items de dulcería...');
        this.dulceriaService.getItemsActivos().subscribe({
            next: function (items) {
                console.log('✅ Items cargados:', items.length);
                _this.items = items;
                _this.aplicarFiltros();
                _this.loading = false;
            },
            error: function (error) {
                console.error('❌ Error al cargar items:', error);
                _this.loading = false;
                alert('Error al cargar los productos. Por favor intente nuevamente.');
            }
        });
    };
    VenderDulceriaComponent.prototype.aplicarFiltros = function () {
        var _this = this;
        this.itemsFiltrados = this.items.filter(function (item) {
            var _a;
            var matchBusqueda = !_this.filtroBusqueda ||
                item.nombre.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()) || ((_a = item.descripcion) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(_this.filtroBusqueda.toLowerCase()));
            var matchTipo = !_this.filtroTipo || item.tipo === _this.filtroTipo;
            return matchBusqueda && matchTipo;
        });
    };
    VenderDulceriaComponent.prototype.limpiarFiltros = function () {
        this.filtroBusqueda = '';
        this.filtroTipo = '';
        this.aplicarFiltros();
    };
    VenderDulceriaComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroBusqueda || this.filtroTipo);
    };
    VenderDulceriaComponent.prototype.agregarAlCarrito = function (item) {
        console.log('➕ Agregando al carrito:', item.nombre);
        if (this.carrito.has(item.id)) {
            var itemCarrito = this.carrito.get(item.id);
            itemCarrito.cantidad++;
        }
        else {
            this.carrito.set(item.id, {
                item: item,
                cantidad: 1
            });
        }
        this.calcularTotales();
    };
    VenderDulceriaComponent.prototype.quitarDelCarrito = function (itemId) {
        console.log('➖ Quitando del carrito:', itemId);
        if (this.carrito.has(itemId)) {
            var itemCarrito = this.carrito.get(itemId);
            if (itemCarrito.cantidad > 1) {
                itemCarrito.cantidad--;
            }
            else {
                this.carrito["delete"](itemId);
            }
            this.calcularTotales();
        }
    };
    VenderDulceriaComponent.prototype.eliminarDelCarrito = function (itemId) {
        console.log('🗑️ Eliminando del carrito:', itemId);
        this.carrito["delete"](itemId);
        this.calcularTotales();
    };
    VenderDulceriaComponent.prototype.actualizarCantidad = function (itemId, cantidad) {
        if (cantidad <= 0) {
            this.eliminarDelCarrito(itemId);
            return;
        }
        if (this.carrito.has(itemId)) {
            this.carrito.get(itemId).cantidad = cantidad;
            this.calcularTotales();
        }
    };
    VenderDulceriaComponent.prototype.calcularTotales = function () {
        var _this = this;
        this.totalVenta = 0;
        this.cantidadTotal = 0;
        this.carrito.forEach(function (itemCarrito) {
            _this.totalVenta += itemCarrito.item.precio * itemCarrito.cantidad;
            _this.cantidadTotal += itemCarrito.cantidad;
        });
    };
    VenderDulceriaComponent.prototype.getItemsCarrito = function () {
        return Array.from(this.carrito.values());
    };
    VenderDulceriaComponent.prototype.confirmarVenta = function () {
        console.log('🎯 Confirmar venta de dulcería');
        if (this.carrito.size === 0) {
            alert('El carrito está vacío. Agregue productos para continuar.');
            return;
        }
        this.mostrarModalConfirmacion = true;
    };
    VenderDulceriaComponent.prototype.procesarVenta = function () {
        var _this = this;
        console.log('🚀 Procesando venta de dulcería...');
        var currentUser = this.authService.getCurrentUser();
        if (!currentUser || !currentUser.id) {
            console.error('❌ Usuario no autenticado');
            alert('Error de autenticación. Por favor inicie sesión nuevamente.');
            return;
        }
        this.procesandoVenta = true;
        // Preparar los datos de la venta para el backend
        var itemsVenta = Array.from(this.carrito.values()).map(function (itemCarrito) { return ({
            dulceriaItemId: itemCarrito.item.id,
            cantidad: itemCarrito.cantidad
        }); });
        // Llamar al endpoint del backend
        this.dulceriaService.procesarVenta(itemsVenta).subscribe({
            next: function (response) {
                var _a;
                console.log('✅ Venta procesada exitosamente:', response);
                // Preparar datos para mostrar en el ticket
                var itemsConDetalle = Array.from(_this.carrito.values()).map(function (itemCarrito) { return ({
                    dulceriaItemId: itemCarrito.item.id,
                    nombre: itemCarrito.item.nombre,
                    cantidad: itemCarrito.cantidad,
                    precioUnitario: itemCarrito.item.precio,
                    subtotal: itemCarrito.item.precio * itemCarrito.cantidad
                }); });
                // Guardar datos de la venta exitosa
                _this.ventaExitosa = {
                    items: itemsConDetalle,
                    total: _this.totalVenta,
                    cantidadTotal: _this.cantidadTotal,
                    fecha: new Date(),
                    vendedor: currentUser,
                    pedidoId: (_a = response.pedido) === null || _a === void 0 ? void 0 : _a.id
                };
                _this.procesandoVenta = false;
                _this.mostrarModalConfirmacion = false;
                _this.mostrarModalExito = true;
                // Limpiar carrito
                _this.carrito.clear();
                _this.calcularTotales();
            },
            error: function (error) {
                var _a;
                console.error('❌ Error al procesar la venta:', error);
                _this.procesandoVenta = false;
                var mensaje = 'Ocurrió un error al procesar la venta. Por favor intente nuevamente.';
                if ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) {
                    mensaje = error.error.message;
                }
                alert(mensaje);
            }
        });
    };
    VenderDulceriaComponent.prototype.cancelarVenta = function () {
        if (this.procesandoVenta) {
            return;
        }
        this.mostrarModalConfirmacion = false;
    };
    VenderDulceriaComponent.prototype.cerrarModalExito = function () {
        this.mostrarModalExito = false;
        this.ventaExitosa = null;
    };
    VenderDulceriaComponent.prototype.irANuevaVenta = function () {
        this.cerrarModalExito();
        this.carrito.clear();
        this.calcularTotales();
    };
    VenderDulceriaComponent.prototype.imprimirTicket = function () {
        if (!this.ventaExitosa) {
            alert('No hay datos de venta para imprimir');
            return;
        }
        console.log('🖨️ Generando ticket de venta...');
        var htmlTicket = this.generarHTMLTicket();
        var ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
        if (!ventanaImpresion) {
            alert('No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.');
            return;
        }
        ventanaImpresion.document.write(htmlTicket);
        ventanaImpresion.document.close();
        ventanaImpresion.document.title = 'Ticket de Venta - Dulcería';
        ventanaImpresion.onload = function () {
            setTimeout(function () {
                ventanaImpresion.print();
            }, 300);
        };
    };
    VenderDulceriaComponent.prototype.generarHTMLTicket = function () {
        var fecha = this.ventaExitosa.fecha;
        var html = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"UTF-8\">\n        <title>Ticket de Venta - Dulcer\u00EDa</title>\n        <style>\n          @page { size: 80mm auto; margin: 5mm; }\n          body { \n            font-family: 'Courier New', monospace; \n            font-size: 12px; \n            width: 80mm;\n            margin: 0 auto;\n            padding: 10px;\n          }\n          .header { text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }\n          .title { font-size: 18px; font-weight: bold; }\n          .subtitle { font-size: 14px; margin-top: 5px; }\n          .fecha { font-size: 11px; margin-top: 10px; }\n          .items { margin: 15px 0; }\n          .item { margin: 8px 0; display: flex; justify-content: space-between; }\n          .item-nombre { flex: 1; }\n          .item-cantidad { width: 40px; text-align: center; }\n          .item-precio { width: 80px; text-align: right; }\n          .totales { border-top: 2px dashed #000; padding-top: 10px; margin-top: 15px; }\n          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }\n          .total-final { font-size: 16px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }\n          .footer { text-align: center; margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px; font-size: 11px; }\n          @media print {\n            body { background: white; }\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"header\">\n          <div class=\"title\">\uD83C\uDF7F CINE DIGITAL \uD83C\uDF7F</div>\n          <div class=\"subtitle\">TICKET DE DULCER\u00CDA</div>\n          <div class=\"fecha\">" + this.formatearFecha(fecha.toISOString()) + " " + this.formatearHora(fecha.toISOString()) + "</div>\n        </div>\n        \n        <div class=\"items\">\n    ";
        this.ventaExitosa.items.forEach(function (item) {
            html += "\n          <div class=\"item\">\n            <span class=\"item-nombre\">" + item.nombre + "</span>\n            <span class=\"item-cantidad\">x" + item.cantidad + "</span>\n            <span class=\"item-precio\">$" + item.subtotal.toFixed(2) + "</span>\n          </div>\n      ";
        });
        html += "\n        </div>\n        \n        <div class=\"totales\">\n          <div class=\"total-row\">\n            <span>Cantidad de items:</span>\n            <span>" + this.ventaExitosa.cantidadTotal + "</span>\n          </div>\n          <div class=\"total-row total-final\">\n            <span>TOTAL:</span>\n            <span>$" + this.ventaExitosa.total.toFixed(2) + "</span>\n          </div>\n        </div>\n        \n        <div class=\"footer\">\n          <p>\u00A1Gracias por su compra!</p>\n          <p>Disfrute su funci\u00F3n</p>\n          <p>Vendedor: " + this.ventaExitosa.vendedor.nombre + "</p>\n        </div>\n      </body>\n      </html>\n    ";
        return html;
    };
    VenderDulceriaComponent.prototype.volverInicio = function () {
        this.router.navigate(['/vendedor']);
    };
    VenderDulceriaComponent.prototype.limpiarCarrito = function () {
        if (this.carrito.size === 0) {
            return;
        }
        if (confirm('¿Está seguro de que desea vaciar el carrito?')) {
            this.carrito.clear();
            this.calcularTotales();
        }
    };
    VenderDulceriaComponent.prototype.formatearPrecio = function (precio) {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU'
        }).format(precio);
    };
    VenderDulceriaComponent.prototype.formatearFecha = function (fecha) {
        var date = new Date(fecha);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };
    VenderDulceriaComponent.prototype.formatearHora = function (fecha) {
        var date = new Date(fecha);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    VenderDulceriaComponent.prototype.getTipoIcono = function (tipo) {
        switch (tipo) {
            case dulceria_model_1.DulceriaItemTipo.COMBO:
                return '🍿';
            case dulceria_model_1.DulceriaItemTipo.DULCE:
                return '🍬';
            default:
                return '🛒';
        }
    };
    VenderDulceriaComponent = __decorate([
        core_1.Component({
            selector: 'app-vender-dulceria',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule],
            templateUrl: './vender-dulceria.component.html',
            styleUrls: ['./vender-dulceria.component.scss']
        })
    ], VenderDulceriaComponent);
    return VenderDulceriaComponent;
}());
exports.VenderDulceriaComponent = VenderDulceriaComponent;
