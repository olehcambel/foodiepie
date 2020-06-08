import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from '../../entities/courier.entity';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';

@Module({
  imports: [TypeOrmModule.forFeature([Courier])],
  controllers: [CourierController],
  providers: [CourierService],
  // exports: [],
})
export class CourierModule {}
