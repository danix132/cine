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
exports.CreatePeliculaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreatePeliculaDto {
}
exports.CreatePeliculaDto = CreatePeliculaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Avengers: Endgame', minLength: 2, maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Los Vengadores se reúnen una vez más...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "sinopsis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 181, minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePeliculaDto.prototype, "duracionMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B-13', minLength: 1, maxLength: 10 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "clasificacion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/poster.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "posterUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://youtube.com/watch?v=...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "trailerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Acción', 'Aventura', 'Ciencia Ficción'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePeliculaDto.prototype, "generos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PeliculaEstado, default: client_1.PeliculaEstado.ACTIVA }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PeliculaEstado),
    __metadata("design:type", String)
], CreatePeliculaDto.prototype, "estado", void 0);
//# sourceMappingURL=create-pelicula.dto.js.map