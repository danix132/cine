"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AllExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var AllExceptionsFilter = /** @class */ (function () {
    function AllExceptionsFilter() {
    }
    AllExceptionsFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        console.error('🚨 EXCEPTION FILTER - Error capturado:');
        console.error('- URL:', request.method, request.url);
        console.error('- Body:', request.body);
        console.error('- Exception type:', exception.constructor.name);
        console.error('- Exception:', exception);
        var status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        var message = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            var exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message || message;
            console.error('- HTTP Exception Status:', status);
            console.error('- HTTP Exception Response:', exceptionResponse);
        }
        else if (exception instanceof Error) {
            console.error('- Error message:', exception.message);
            console.error('- Error stack:', exception.stack);
            message = exception.message;
        }
        var errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message
        };
        console.error('- Response sent:', errorResponse);
        response.status(status).json(errorResponse);
    };
    AllExceptionsFilter = __decorate([
        common_1.Catch()
    ], AllExceptionsFilter);
    return AllExceptionsFilter;
}());
exports.AllExceptionsFilter = AllExceptionsFilter;
