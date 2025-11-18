import { Module } from '@nestjs/common';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ListModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
