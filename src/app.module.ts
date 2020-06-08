import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrderModule } from './modules/order/order.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    CustomerModule,
    OrderModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
