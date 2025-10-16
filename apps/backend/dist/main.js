"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const moment = require("moment-timezone");
async function bootstrap() {
    process.removeAllListeners('warning');
    process.on('warning', (warning) => {
        if (warning.name !== 'DeprecationWarning' || !warning.message.includes('url.parse()')) {
            console.warn(warning.message);
        }
    });
    moment.tz.setDefault('America/Mazatlan');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Cine API')
        .setDescription('API para sistema de gestión de cine')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Autenticación')
        .addTag('users', 'Usuarios')
        .addTag('salas', 'Salas de cine')
        .addTag('peliculas', 'Películas')
        .addTag('funciones', 'Funciones')
        .addTag('boletos', 'Boletos')
        .addTag('carritos', 'Carritos de compra')
        .addTag('pedidos', 'Pedidos')
        .addTag('dulceria', 'Dulcería')
        .addTag('reportes', 'Reportes')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
    console.log(`📚 Documentación Swagger en: http://localhost:${port}/docs`);
    console.log(`🌍 Zona horaria configurada: America/Mazatlan`);
}
bootstrap();
//# sourceMappingURL=main.js.map