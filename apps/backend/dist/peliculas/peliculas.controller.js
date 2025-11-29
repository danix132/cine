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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeliculasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const peliculas_service_1 = require("./peliculas.service");
const recomendaciones_service_1 = require("./recomendaciones.service");
const create_pelicula_dto_1 = require("./dto/create-pelicula.dto");
const update_pelicula_dto_1 = require("./dto/update-pelicula.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let PeliculasController = class PeliculasController {
    constructor(peliculasService, recomendacionesService) {
        this.peliculasService = peliculasService;
        this.recomendacionesService = recomendacionesService;
    }
    create(createPeliculaDto) {
        return this.peliculasService.create(createPeliculaDto);
    }
    findAll(paginationDto) {
        return this.peliculasService.findAll(paginationDto);
    }
    findActive() {
        return this.peliculasService.findActive();
    }
    findByGenero(genero) {
        return this.peliculasService.findByGenero(genero);
    }
    findOne(id) {
        return this.peliculasService.findOne(id);
    }
    update(id, updatePeliculaDto) {
        return this.peliculasService.update(id, updatePeliculaDto);
    }
    remove(id) {
        return this.peliculasService.remove(id);
    }
    forceRemove(id) {
        return this.peliculasService.forceRemove(id);
    }
    getRecomendaciones(req) {
        const userId = req.user.id;
        console.log('🎬 Generando recomendaciones para usuario:', userId);
        return this.recomendacionesService.getRecomendacionesParaUsuario(userId);
    }
};
exports.PeliculasController = PeliculasController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva película (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Película creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pelicula_dto_1.CreatePeliculaDto]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las películas (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de películas' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activas'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener películas activas con funciones (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Películas activas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('genero/:genero'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar películas por género (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Películas del género' }),
    __param(0, (0, common_1.Param)('genero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "findByGenero", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener película por ID con funciones (público)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Película encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Película no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar película (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Película actualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Película no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pelicula_dto_1.UpdatePeliculaDto]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar película (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Película eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Película no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/forzar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Forzar eliminación completa de película (solo admin) - CUIDADO: Elimina todo incluidos boletos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Película forzadamente eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Película no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "forceRemove", null);
__decorate([
    (0, common_1.Get)('recomendaciones/personalizadas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener recomendaciones personalizadas basadas en preferencias del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recomendaciones generadas' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PeliculasController.prototype, "getRecomendaciones", null);
exports.PeliculasController = PeliculasController = __decorate([
    (0, swagger_1.ApiTags)('peliculas'),
    (0, common_1.Controller)('peliculas'),
    __metadata("design:paramtypes", [peliculas_service_1.PeliculasService,
        recomendaciones_service_1.RecomendacionesService])
], PeliculasController);
//# sourceMappingURL=peliculas.controller.js.map