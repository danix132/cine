"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegisterDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var RegisterDto = /** @class */ (function () {
    function RegisterDto() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'Juan Pérez' }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(2),
        class_validator_1.MaxLength(100)
    ], RegisterDto.prototype, "nombre");
    __decorate([
        swagger_1.ApiProperty({ example: 'juan@example.com' }),
        class_validator_1.IsEmail()
    ], RegisterDto.prototype, "email");
    __decorate([
        swagger_1.ApiProperty({ example: 'password123', minLength: 6 }),
        class_validator_1.IsString(),
        class_validator_1.MinLength(6)
    ], RegisterDto.prototype, "password");
    return RegisterDto;
}());
exports.RegisterDto = RegisterDto;
