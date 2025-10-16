"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var moment = require("moment-timezone");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, vendedorPassword, clientePassword, admin, vendedor, cliente, sala1, sala2, asientosSala1, fila, numero, asientosSala2, fila, numero, pelicula1, pelicula2, ahora, funcion1, funcion2, funcion3, funcion4, comboNachos, comboPalomitas, palomitas, refresco, chocolate, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    console.log('🌱 Iniciando seed de la base de datos...');
                    // Limpiar base de datos
                    return [4 /*yield*/, prisma.$transaction([
                            prisma.pedidoItem.deleteMany(),
                            prisma.pedido.deleteMany(),
                            prisma.carritoItem.deleteMany(),
                            prisma.carrito.deleteMany(),
                            prisma.boleto.deleteMany(),
                            prisma.funcion.deleteMany(),
                            prisma.asiento.deleteMany(),
                            prisma.sala.deleteMany(),
                            prisma.pelicula.deleteMany(),
                            prisma.inventarioMov.deleteMany(),
                            prisma.dulceriaItem.deleteMany(),
                            prisma.user.deleteMany(),
                        ])];
                case 1:
                    // Limpiar base de datos
                    _x.sent();
                    console.log('✅ Base de datos limpiada');
                    return [4 /*yield*/, bcrypt.hash('Admin123', 12)];
                case 2:
                    adminPassword = _x.sent();
                    return [4 /*yield*/, bcrypt.hash('Vendedor123', 12)];
                case 3:
                    vendedorPassword = _x.sent();
                    return [4 /*yield*/, bcrypt.hash('Cliente123', 12)];
                case 4:
                    clientePassword = _x.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                nombre: 'Administrador',
                                email: 'admin@cine.com',
                                passwordHash: adminPassword,
                                rol: client_1.UserRole.ADMIN
                            }
                        })];
                case 5:
                    admin = _x.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                nombre: 'Vendedor Mostrador',
                                email: 'vend@cine.com',
                                passwordHash: vendedorPassword,
                                rol: client_1.UserRole.VENDEDOR
                            }
                        })];
                case 6:
                    vendedor = _x.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                nombre: 'Cliente Demo',
                                email: 'cli@cine.com',
                                passwordHash: clientePassword,
                                rol: client_1.UserRole.CLIENTE
                            }
                        })];
                case 7:
                    cliente = _x.sent();
                    console.log('✅ Usuarios creados');
                    return [4 /*yield*/, prisma.sala.create({
                            data: {
                                nombre: 'Sala 1',
                                filas: 8,
                                asientosPorFila: 12
                            }
                        })];
                case 8:
                    sala1 = _x.sent();
                    return [4 /*yield*/, prisma.sala.create({
                            data: {
                                nombre: 'Sala 2',
                                filas: 10,
                                asientosPorFila: 15
                            }
                        })];
                case 9:
                    sala2 = _x.sent();
                    console.log('✅ Salas creadas');
                    asientosSala1 = [];
                    for (fila = 1; fila <= 8; fila++) {
                        for (numero = 1; numero <= 12; numero++) {
                            asientosSala1.push({
                                salaId: sala1.id,
                                fila: fila,
                                numero: numero,
                                estado: 'DISPONIBLE'
                            });
                        }
                    }
                    asientosSala2 = [];
                    for (fila = 1; fila <= 10; fila++) {
                        for (numero = 1; numero <= 15; numero++) {
                            asientosSala2.push({
                                salaId: sala2.id,
                                fila: fila,
                                numero: numero,
                                estado: 'DISPONIBLE'
                            });
                        }
                    }
                    return [4 /*yield*/, prisma.asiento.createMany({
                            data: __spreadArrays(asientosSala1, asientosSala2)
                        })];
                case 10:
                    _x.sent();
                    console.log('✅ Asientos generados');
                    return [4 /*yield*/, prisma.pelicula.create({
                            data: {
                                titulo: 'Avengers: Endgame',
                                sinopsis: 'Los Vengadores se reúnen una vez más para revertir el daño causado por Thanos y restaurar el equilibrio del universo.',
                                duracionMin: 181,
                                clasificacion: 'B-13',
                                posterUrl: 'https://example.com/avengers-poster.jpg',
                                trailerUrl: 'https://youtube.com/watch?v=TcMBFSGVi1c',
                                generos: ['Acción', 'Aventura', 'Ciencia Ficción'],
                                estado: client_1.PeliculaEstado.ACTIVA
                            }
                        })];
                case 11:
                    pelicula1 = _x.sent();
                    return [4 /*yield*/, prisma.pelicula.create({
                            data: {
                                titulo: 'Spider-Man: No Way Home',
                                sinopsis: 'Peter Parker se enfrenta a villanos de diferentes universos mientras busca la ayuda del Doctor Strange.',
                                duracionMin: 148,
                                clasificacion: 'B-13',
                                posterUrl: 'https://example.com/spiderman-poster.jpg',
                                trailerUrl: 'https://youtube.com/watch?v=JfVOs4VSpmA',
                                generos: ['Acción', 'Aventura', 'Ciencia Ficción'],
                                estado: client_1.PeliculaEstado.ACTIVA
                            }
                        })];
                case 12:
                    pelicula2 = _x.sent();
                    console.log('✅ Películas creadas');
                    ahora = moment.tz('America/Mazatlan');
                    return [4 /*yield*/, prisma.funcion.create({
                            data: {
                                peliculaId: pelicula1.id,
                                salaId: sala1.id,
                                inicio: ahora.clone().add(2, 'hours').toDate(),
                                precio: 150.00
                            }
                        })];
                case 13:
                    funcion1 = _x.sent();
                    return [4 /*yield*/, prisma.funcion.create({
                            data: {
                                peliculaId: pelicula1.id,
                                salaId: sala2.id,
                                inicio: ahora.clone().add(5, 'hours').toDate(),
                                precio: 150.00
                            }
                        })];
                case 14:
                    funcion2 = _x.sent();
                    return [4 /*yield*/, prisma.funcion.create({
                            data: {
                                peliculaId: pelicula2.id,
                                salaId: sala1.id,
                                inicio: ahora.clone().add(8, 'hours').toDate(),
                                precio: 140.00
                            }
                        })];
                case 15:
                    funcion3 = _x.sent();
                    return [4 /*yield*/, prisma.funcion.create({
                            data: {
                                peliculaId: pelicula2.id,
                                salaId: sala2.id,
                                inicio: ahora.clone().add(1, 'day').add(2, 'hours').toDate(),
                                precio: 140.00
                            }
                        })];
                case 16:
                    funcion4 = _x.sent();
                    console.log('✅ Funciones creadas');
                    return [4 /*yield*/, prisma.dulceriaItem.create({
                            data: {
                                nombre: 'Combo Nachos Grande',
                                tipo: client_1.DulceriaItemTipo.COMBO,
                                descripcion: 'Nachos con queso, guacamole, salsa y refresco grande',
                                precio: 89.99,
                                activo: true
                            }
                        })];
                case 17:
                    comboNachos = _x.sent();
                    return [4 /*yield*/, prisma.dulceriaItem.create({
                            data: {
                                nombre: 'Combo Palomitas',
                                tipo: client_1.DulceriaItemTipo.COMBO,
                                descripcion: 'Palomitas grandes con refresco y dulce',
                                precio: 75.50,
                                activo: true
                            }
                        })];
                case 18:
                    comboPalomitas = _x.sent();
                    return [4 /*yield*/, prisma.dulceriaItem.create({
                            data: {
                                nombre: 'Palomitas Grandes',
                                tipo: client_1.DulceriaItemTipo.DULCE,
                                descripcion: 'Palomitas de maíz grandes con mantequilla',
                                precio: 45.00,
                                activo: true
                            }
                        })];
                case 19:
                    palomitas = _x.sent();
                    return [4 /*yield*/, prisma.dulceriaItem.create({
                            data: {
                                nombre: 'Refresco Grande',
                                tipo: client_1.DulceriaItemTipo.DULCE,
                                descripcion: 'Refresco de 500ml',
                                precio: 25.00,
                                activo: true
                            }
                        })];
                case 20:
                    refresco = _x.sent();
                    return [4 /*yield*/, prisma.dulceriaItem.create({
                            data: {
                                nombre: 'Chocolate',
                                tipo: client_1.DulceriaItemTipo.DULCE,
                                descripcion: 'Chocolate de leche',
                                precio: 15.00,
                                activo: true
                            }
                        })];
                case 21:
                    chocolate = _x.sent();
                    console.log('✅ Items de dulcería creados');
                    // Registrar movimientos de inventario inicial
                    return [4 /*yield*/, prisma.inventarioMov.createMany({
                            data: [
                                { dulceriaItemId: comboNachos.id, delta: 50, motivo: 'Inventario inicial' },
                                { dulceriaItemId: comboPalomitas.id, delta: 50, motivo: 'Inventario inicial' },
                                { dulceriaItemId: palomitas.id, delta: 100, motivo: 'Inventario inicial' },
                                { dulceriaItemId: refresco.id, delta: 200, motivo: 'Inventario inicial' },
                                { dulceriaItemId: chocolate.id, delta: 150, motivo: 'Inventario inicial' },
                            ]
                        })];
                case 22:
                    // Registrar movimientos de inventario inicial
                    _x.sent();
                    console.log('✅ Inventario inicial registrado');
                    console.log('\n🎉 Seed completado exitosamente!');
                    console.log('\n📋 Datos creados:');
                    _b = (_a = console).log;
                    _c = "\uD83D\uDC65 Usuarios: ";
                    return [4 /*yield*/, prisma.user.count()];
                case 23:
                    _b.apply(_a, [_c + (_x.sent())]);
                    _e = (_d = console).log;
                    _f = "\uD83C\uDFE2 Salas: ";
                    return [4 /*yield*/, prisma.sala.count()];
                case 24:
                    _e.apply(_d, [_f + (_x.sent())]);
                    _h = (_g = console).log;
                    _j = "\uD83E\uDE91 Asientos: ";
                    return [4 /*yield*/, prisma.asiento.count()];
                case 25:
                    _h.apply(_g, [_j + (_x.sent())]);
                    _l = (_k = console).log;
                    _m = "\uD83C\uDFAC Pel\u00EDculas: ";
                    return [4 /*yield*/, prisma.pelicula.count()];
                case 26:
                    _l.apply(_k, [_m + (_x.sent())]);
                    _p = (_o = console).log;
                    _q = "\uD83C\uDFAD Funciones: ";
                    return [4 /*yield*/, prisma.funcion.count()];
                case 27:
                    _p.apply(_o, [_q + (_x.sent())]);
                    _s = (_r = console).log;
                    _t = "\uD83C\uDF7F Items de dulcer\u00EDa: ";
                    return [4 /*yield*/, prisma.dulceriaItem.count()];
                case 28:
                    _s.apply(_r, [_t + (_x.sent())]);
                    _v = (_u = console).log;
                    _w = "\uD83D\uDCE6 Movimientos de inventario: ";
                    return [4 /*yield*/, prisma.inventarioMov.count()];
                case 29:
                    _v.apply(_u, [_w + (_x.sent())]);
                    console.log('\n🔑 Credenciales de acceso:');
                    console.log('👨‍💼 Admin: admin@cine.com / Admin123');
                    console.log('👨‍💻 Vendedor: vend@cine.com / Vendedor123');
                    console.log('👤 Cliente: cli@cine.com / Cliente123');
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
