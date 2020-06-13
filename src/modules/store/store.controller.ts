import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/access.decorator';
import { ApiUserType } from '../../decorators/user-type.decorator';
import { Product } from '../../entities/product.entity';
import { Store } from '../../entities/store.entity';
import { StoresResDto } from './dto/store-res.dto';
import {
  CreateStoreDto,
  GetStoresDto,
  SaveProductsDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { StoreService } from './store.service';

@Controller('stores')
@ApiBearerAuth()
@ApiTags('Store')
export class StoreController {
  constructor(private readonly service: StoreService) {}

  @Post()
  @ApiUserType('customer')
  createStore(
    @Req() req: JWTReq.User,
    @Body() params: CreateStoreDto,
  ): Promise<Store> {
    return this.service.createStore(req.user.id, params);
  }

  @Get()
  @Public()
  getStores(@Query() params: GetStoresDto): Promise<StoresResDto> {
    return this.service.getStores(params);
  }

  @Get(':storeId')
  @Public()
  getStore(@Param('storeId', ParseIntPipe) storeID: number): Promise<Store> {
    return this.service.getStore(storeID);
  }

  @Put(':storeId')
  @ApiUserType('customer')
  updateStore(
    @Req() req: JWTReq.User,
    @Param('storeId', ParseIntPipe) storeID: number,
    @Body() params: UpdateStoreDto,
  ): Promise<Store> {
    return this.service.updateStore(req.user.id, storeID, params);
  }

  @Delete(':storeId')
  @ApiUserType('customer')
  deleteStore(
    @Req() req: JWTReq.User,
    @Param('storeId', ParseIntPipe) storeID: number,
  ): Promise<boolean> {
    return this.service.deleteStore(req.user.id, storeID);
  }

  @Get(':storeId/menus')
  @Public()
  getMenus(
    @Param('storeId', ParseIntPipe) storeID: number,
  ): Promise<Product[]> {
    return this.service.getMenus(storeID);
  }

  @Put(':storeId/menus')
  @ApiUserType('customer')
  saveMenus(
    @Req() req: JWTReq.User,
    @Param('storeId', ParseIntPipe) storeID: number,
    @Body() params: SaveProductsDto,
  ): Promise<Product[]> {
    return this.service.saveMenus(req.user.id, storeID, params);
  }
}
