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
exports.UpdateDulceriaItemDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_dulceria_item_dto_1 = require("./create-dulceria-item.dto");
var UpdateDulceriaItemDto = /** @class */ (function (_super) {
    __extends(UpdateDulceriaItemDto, _super);
    function UpdateDulceriaItemDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateDulceriaItemDto;
}(swagger_1.PartialType(create_dulceria_item_dto_1.CreateDulceriaItemDto)));
exports.UpdateDulceriaItemDto = UpdateDulceriaItemDto;
