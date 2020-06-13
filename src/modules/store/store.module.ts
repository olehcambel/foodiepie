import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Product } from '../../entities/product.entity';
import { ProductTranslation } from '../../entities/product-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product, ProductTranslation])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
