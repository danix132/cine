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
exports.UpdatePeliculaDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_pelicula_dto_1 = require("./create-pelicula.dto");
var UpdatePeliculaDto = /** @class */ (function (_super) {
    __extends(UpdatePeliculaDto, _super);
    function UpdatePeliculaDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdatePeliculaDto;
}(swagger_1.PartialType(create_pelicula_dto_1.CreatePeliculaDto)));
exports.UpdatePeliculaDto = UpdatePeliculaDto;
