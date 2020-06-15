import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CourierModule } from './modules/courier/courier.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrderModule } from './modules/order/order.module';
import { StatsModule } from './modules/stats/stats.module';
import { StoreModule } from './modules/store/store.module';
import { ManagerModule } from './modules/manager/manager.module';
import { PrefixlessModule } from './modules/app/prefixless.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    CustomerModule,
    OrderModule,
    StatsModule,
    StoreModule,
    CourierModule,
    ManagerModule,
    PrefixlessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
