"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var pagination_dto_1 = require("../common/dto/pagination.dto");
var bcrypt = require("bcryptjs");
var UsersService = /** @class */ (function () {
    function UsersService(prisma) {
        this.prisma = prisma;
    }
    UsersService.prototype.create = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, userData, existingUser, passwordHash, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = createUserDto.email, password = createUserDto.password, userData = __rest(createUserDto, ["email", "password"]);
                        return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: email }
                            })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new common_1.ConflictException('El email ya está registrado');
                        }
                        return [4 /*yield*/, bcrypt.hash(password, 12)];
                    case 2:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, this.prisma.user.create({
                                data: __assign(__assign({}, userData), { email: email,
                                    passwordHash: passwordHash }),
                                select: {
                                    id: true,
                                    email: true,
                                    nombre: true,
                                    rol: true,
                                    createdAt: true,
                                    updatedAt: true
                                }
                            })];
                    case 3:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.findAll = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, search, rol, skip, where, _a, users, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = parseInt(query.page) || 1;
                        limit = parseInt(query.limit) || 10;
                        search = query.search || '';
                        rol = query.rol;
                        skip = (page - 1) * limit;
                        where = {};
                        if (search) {
                            where = {
                                OR: [
                                    { nombre: { contains: search, mode: 'insensitive' } },
                                    { email: { contains: search, mode: 'insensitive' } },
                                ]
                            };
                        }
                        if (rol)
                            where.rol = rol;
                        return [4 /*yield*/, Promise.all([
                                this.prisma.user.findMany({
                                    where: where,
                                    select: {
                                        id: true,
                                        nombre: true,
                                        email: true,
                                        rol: true,
                                        createdAt: true,
                                        updatedAt: true,
                                        _count: {
                                            select: {
                                                boletos: true,
                                                carritos: true,
                                                pedidos: true
                                            }
                                        }
                                    },
                                    skip: skip,
                                    take: limit,
                                    orderBy: { nombre: 'asc' }
                                }),
                                this.prisma.user.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), users = _a[0], total = _a[1];
                        return [2 /*return*/, pagination_dto_1.createPaginatedResponse(users, total, page, limit)];
                }
            });
        });
    };
    UsersService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { id: id },
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                rol: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('Usuario no encontrado');
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.update = function (id, updateUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var password, updateData, data, _a, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        password = updateUserDto.password, updateData = __rest(updateUserDto, ["password"]);
                        // Verificar si el usuario existe
                        return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si el usuario existe
                        _b.sent();
                        data = __assign({}, updateData);
                        if (!password) return [3 /*break*/, 3];
                        _a = data;
                        return [4 /*yield*/, bcrypt.hash(password, 12)];
                    case 2:
                        _a.passwordHash = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.prisma.user.update({
                            where: { id: id },
                            data: data,
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                rol: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        })];
                    case 4:
                        user = _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar si el usuario existe
                    return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        // Verificar si el usuario existe
                        _a.sent();
                        return [4 /*yield*/, this.prisma.user["delete"]({
                                where: { id: id }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: 'Usuario eliminado exitosamente' }];
                }
            });
        });
    };
    UsersService.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findUnique({
                        where: { email: email }
                    })];
            });
        });
    };
    UsersService = __decorate([
        common_1.Injectable()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
