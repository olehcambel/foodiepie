import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/access.decorator';
import { StoreAddress } from '../../entities/store-address.entity';
import { StoreType } from '../../entities/store-type.entity';
import { Store } from '../../entities/store.entity';
import { StoreService } from './store.service';

@Controller('stores')
@Public()
@ApiTags('Store')
export class StoreController {
  constructor(private readonly service: StoreService) {}

  @Get('/:storeId')
  getStore(@Param('storeId', ParseIntPipe) storeID: number): Promise<Store> {
    return this.service.getStore(storeID);
  }

  @Get('/:storeId/addresses/:addressId')
  getStoreAddress(
    @Param('addressId', ParseIntPipe) addressID: number,
  ): Promise<StoreAddress> {
    return this.service.getStoreAddress(addressID);
  }

  @Get('/types')
  getStoreTypes(): Promise<StoreType[]> {
    return this.service.getTypes();
  }
}
