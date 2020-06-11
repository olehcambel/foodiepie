import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from '../../entities/courier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courier])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
