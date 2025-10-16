import { Module } from '@nestjs/common';
import { DulceriaService } from './dulceria.service';
import { DulceriaController } from './dulceria.controller';

@Module({
  controllers: [DulceriaController],
  providers: [DulceriaService],
  exports: [DulceriaService],
})
export class DulceriaModule {}
