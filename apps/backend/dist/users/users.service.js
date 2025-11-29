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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const { email, password, ...userData } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                email,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async findAll(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const search = query.search || '';
        const rol = query.rol;
        const skip = (page - 1) * limit;
        let where = {};
        if (search) {
            where = {
                OR: [
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            };
        }
        if (rol)
            where.rol = rol;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
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
                            pedidos: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { nombre: 'asc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(users, total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async update(id, updateUserDto) {
        const { password, ...updateData } = updateUserDto;
        await this.findOne(id);
        const data = { ...updateData };
        if (password) {
            data.passwordHash = await bcrypt.hash(password, 12);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'Usuario eliminado exitosamente' };
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.ConflictException('La contraseña actual es incorrecta');
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });
        return { message: 'Contraseña actualizada exitosamente' };
    }
    async updatePreferencias(userId, generosPreferidos) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { generosPreferidos },
        });
        return { message: 'Preferencias actualizadas exitosamente', generosPreferidos };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map