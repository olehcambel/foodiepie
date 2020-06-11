import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from '../../entities/courier.entity';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courier, Order])],
  controllers: [CourierController],
  providers: [CourierService],
})
export class CourierModule {}
