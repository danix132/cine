"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreatePeliculaDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreatePeliculaDto = /** @class */ (function () {
    function CreatePeliculaDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'Avengers: Endgame', minLength: 2, maxLength: 200 }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(2),
        class_validator_1.MaxLength(200)
    ], CreatePeliculaDto.prototype, "titulo");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'Los Vengadores se reúnen una vez más...' }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString(),
        class_validator_1.MaxLength(1000)
    ], CreatePeliculaDto.prototype, "sinopsis");
    __decorate([
        swagger_1.ApiProperty({ example: 181, minimum: 1 }),
        class_validator_1.IsInt(),
        class_validator_1.Min(1)
    ], CreatePeliculaDto.prototype, "duracionMin");
    __decorate([
        swagger_1.ApiProperty({ example: 'B-13', minLength: 1, maxLength: 10 }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(1),
        class_validator_1.MaxLength(10)
    ], CreatePeliculaDto.prototype, "clasificacion");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'https://example.com/poster.jpg' }),
        class_validator_1.IsOptional(),
        class_validator_1.IsUrl()
    ], CreatePeliculaDto.prototype, "posterUrl");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' }),
        class_validator_1.IsOptional(),
        class_validator_1.IsUrl()
    ], CreatePeliculaDto.prototype, "trailerUrl");
    __decorate([
        swagger_1.ApiProperty({ example: ['Acción', 'Aventura', 'Ciencia Ficción'] }),
        class_validator_1.IsArray(),
        class_validator_1.IsString({ each: true })
    ], CreatePeliculaDto.prototype, "generos");
    __decorate([
        swagger_1.ApiPropertyOptional({ "enum": client_1.PeliculaEstado, "default": client_1.PeliculaEstado.ACTIVA }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(client_1.PeliculaEstado)
    ], CreatePeliculaDto.prototype, "estado");
    return CreatePeliculaDto;
}());
exports.CreatePeliculaDto = CreatePeliculaDto;
