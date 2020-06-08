import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreAddress } from '../../entities/store-address.entity';
import { StoreType } from '../../entities/store-type.entity';
import { Store } from '../../entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreAddress, StoreType])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
