"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBoletoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_boleto_dto_1 = require("./create-boleto.dto");
class UpdateBoletoDto extends (0, swagger_1.PartialType)(create_boleto_dto_1.CreateBoletoDto) {
}
exports.UpdateBoletoDto = UpdateBoletoDto;
//# sourceMappingURL=update-boleto.dto.js.map