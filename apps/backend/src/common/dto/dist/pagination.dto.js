"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.createPaginatedResponse = exports.PaginatedResponseDto = exports.PaginationDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var PaginationDto = /** @class */ (function () {
    function PaginationDto() {
        this.page = 1;
        this.limit = 10;
        this.sortOrder = 'desc';
    }
    __decorate([
        swagger_1.ApiPropertyOptional({ "default": 1, minimum: 1 }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], PaginationDto.prototype, "page");
    __decorate([
        swagger_1.ApiPropertyOptional({ "default": 10, minimum: 1, maximum: 100 }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive(),
        class_validator_1.Min(1)
    ], PaginationDto.prototype, "limit");
    __decorate([
        swagger_1.ApiPropertyOptional(),
        class_validator_1.IsOptional()
    ], PaginationDto.prototype, "search");
    __decorate([
        swagger_1.ApiPropertyOptional(),
        class_validator_1.IsOptional()
    ], PaginationDto.prototype, "sortBy");
    __decorate([
        swagger_1.ApiPropertyOptional({ "enum": ['asc', 'desc'], "default": 'desc' }),
        class_validator_1.IsOptional()
    ], PaginationDto.prototype, "sortOrder");
    return PaginationDto;
}());
exports.PaginationDto = PaginationDto;
var PaginatedResponseDto = /** @class */ (function () {
    function PaginatedResponseDto() {
    }
    return PaginatedResponseDto;
}());
exports.PaginatedResponseDto = PaginatedResponseDto;
function createPaginatedResponse(data, total, page, limit) {
    var totalPages = Math.ceil(total / limit);
    return {
        data: data,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}
exports.createPaginatedResponse = createPaginatedResponse;
