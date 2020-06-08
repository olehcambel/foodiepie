import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { OrderAddress } from '../../entities/order-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderAddress])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
