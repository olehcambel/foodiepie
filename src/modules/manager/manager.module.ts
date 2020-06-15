import { Module } from '@nestjs/common';
import { CourierModule } from '../courier/courier.module';
import { CustomerModule } from '../customer/customer.module';
import { StoreModule } from '../store/store.module';
import { ManagerController } from './manager.controller';

@Module({
  imports: [CustomerModule, CourierModule, StoreModule],
  controllers: [ManagerController],
})
export class ManagerModule {}
