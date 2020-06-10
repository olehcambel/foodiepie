import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
