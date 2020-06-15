import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../entities/customer.entity';
import { Courier } from '../../entities/courier.entity';
import { Manager } from '../../entities/manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Courier, Manager]),
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
