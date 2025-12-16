import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { RecomendacionesService } from './recomendaciones.service';
import { GeminiService } from '../modules/gemini.service';

@Module({
  controllers: [PeliculasController],
  providers: [PeliculasService, RecomendacionesService, GeminiService],
  exports: [PeliculasService],
})
export class PeliculasModule {}
