import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as moment from 'moment-timezone';

async function bootstrap() {
  // Suprimir warnings de deprecación específicos para url.parse
  process.removeAllListeners('warning');
  process.on('warning', (warning) => {
    // Solo mostrar warnings que no sean DEP0169 (url.parse deprecation)
    if (warning.name !== 'DeprecationWarning' || !warning.message.includes('url.parse()')) {
      console.warn(warning.message);
    }
  });

  // Configurar zona horaria
  moment.tz.setDefault('America/Mazatlan');

  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:3000'],
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar filtro de excepciones global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  // Configurar Swagger
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger en: http://localhost:${port}/docs`);
  console.log(`🌍 Zona horaria configurada: America/Mazatlan`);
}

bootstrap(); 
