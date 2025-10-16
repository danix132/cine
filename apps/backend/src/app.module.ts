import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SalasModule } from './salas/salas.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { FuncionesModule } from './funciones/funciones.module';
import { BoletosModule } from './boletos/boletos.module';
import { CarritosModule } from './carritos/carritos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { DulceriaModule } from './dulceria/dulceria.module';
import { ReportesModule } from './reportes/reportes.module';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    SalasModule,
    PeliculasModule,
    FuncionesModule,
    BoletosModule,
    CarritosModule,
    PedidosModule,
    DulceriaModule,
    ReportesModule,
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 
