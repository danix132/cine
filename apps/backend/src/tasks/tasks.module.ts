import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CarritosModule } from '../carritos/carritos.module';

@Module({
  imports: [CarritosModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
