import { Module } from '@nestjs/common';
import { CourierModule } from '../courier/courier.module';
import { CustomerModule } from '../customer/customer.module';
import { ManagerController } from './manager.controller';

@Module({
  imports: [CustomerModule, CourierModule],
  controllers: [ManagerController],
  // providers: [ManagerService],
})
export class ManagerModule {}
