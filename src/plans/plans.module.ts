import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  providers: [PlansService],
  controllers: [PlansController]
})
export class PlansModule {}
