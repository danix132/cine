"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateUserDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreateUserDto = /** @class */ (function () {
    function CreateUserDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'Juan Pérez' }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(2),
        class_validator_1.MaxLength(100)
    ], CreateUserDto.prototype, "nombre");
    __decorate([
        swagger_1.ApiProperty({ example: 'juan@example.com' }),
        class_validator_1.IsEmail()
    ], CreateUserDto.prototype, "email");
    __decorate([
        swagger_1.ApiProperty({ example: 'password123', minLength: 6 }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(6)
    ], CreateUserDto.prototype, "password");
    __decorate([
        swagger_1.ApiPropertyOptional({ "enum": client_1.UserRole, "default": client_1.UserRole.CLIENTE }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(client_1.UserRole)
    ], CreateUserDto.prototype, "rol");
    return CreateUserDto;
}());
exports.CreateUserDto = CreateUserDto;
