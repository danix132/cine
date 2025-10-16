"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFuncionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateFuncionDto {
}
exports.CreateFuncionDto = CreateFuncionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clm1234567890abcdef' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFuncionDto.prototype, "peliculaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cls1234567890abcdef' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFuncionDto.prototype, "salaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T20:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFuncionDto.prototype, "inicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.00, minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFuncionDto.prototype, "precio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFuncionDto.prototype, "forzarCreacion", void 0);
//# sourceMappingURL=create-funcion.dto.js.map