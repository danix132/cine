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
exports.CreateSalaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateSalaDto {
}
exports.CreateSalaDto = CreateSalaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sala 1', minLength: 2, maxLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateSalaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, minimum: 1, maximum: 20 }),
    (0, class_transformer_1.Transform)(({ value }) => {
        console.log('🔢 Transformando filas:', value, typeof value);
        return parseInt(value);
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreateSalaDto.prototype, "filas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, minimum: 1, maximum: 25 }),
    (0, class_transformer_1.Transform)(({ value }) => {
        console.log('🔢 Transformando asientosPorFila:', value, typeof value);
        return parseInt(value);
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(25),
    __metadata("design:type", Number)
], CreateSalaDto.prototype, "asientosPorFila", void 0);
//# sourceMappingURL=create-sala.dto.js.map