"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.UpdatePedidoDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_pedido_dto_1 = require("./create-pedido.dto");
var UpdatePedidoDto = /** @class */ (function (_super) {
    __extends(UpdatePedidoDto, _super);
    function UpdatePedidoDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdatePedidoDto;
}(swagger_1.PartialType(create_pedido_dto_1.CreatePedidoDto)));
exports.UpdatePedidoDto = UpdatePedidoDto;
