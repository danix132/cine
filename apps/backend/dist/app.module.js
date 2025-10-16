"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const salas_module_1 = require("./salas/salas.module");
const peliculas_module_1 = require("./peliculas/peliculas.module");
const funciones_module_1 = require("./funciones/funciones.module");
const boletos_module_1 = require("./boletos/boletos.module");
const carritos_module_1 = require("./carritos/carritos.module");
const pedidos_module_1 = require("./pedidos/pedidos.module");
const dulceria_module_1 = require("./dulceria/dulceria.module");
const reportes_module_1 = require("./reportes/reportes.module");
const tasks_module_1 = require("./tasks/tasks.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            salas_module_1.SalasModule,
            peliculas_module_1.PeliculasModule,
            funciones_module_1.FuncionesModule,
            boletos_module_1.BoletosModule,
            carritos_module_1.CarritosModule,
            pedidos_module_1.PedidosModule,
            dulceria_module_1.DulceriaModule,
            reportes_module_1.ReportesModule,
            tasks_module_1.TasksModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map