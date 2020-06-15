import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUserType } from '../../decorators/user-type.decorator';
import { Courier } from '../../entities/courier.entity';
import { Customer } from '../../entities/customer.entity';
import { Store } from '../../entities/store.entity';
import { CourierService } from '../courier/courier.service';
import { CouriersResDto } from '../courier/dto/courier-res.dto';
import {
  GetCouriersDto,
  UpdateCourierFullDto,
} from '../courier/dto/courier.dto';
import { CustomerService } from '../customer/customer.service';
import { UpdateCustomerFullDto } from '../customer/dto/customer.dto';
import { UpdateStoreFullDto } from '../store/dto/store.dto';
import { StoreService } from '../store/store.service';

@Controller('managers')
@ApiTags('Manager')
@ApiBearerAuth()
export class ManagerController {
  constructor(
    private readonly courierService: CourierService,
    private readonly customerService: CustomerService,
    private readonly storeService: StoreService,
  ) {}

  @Get('couriers')
  @ApiUserType('manager')
  getCouriers(@Query() params: GetCouriersDto): Promise<CouriersResDto> {
    return this.courierService.find(params);
  }

  @Get('couriers/:courierId')
  @ApiUserType('manager')
  getCourier(@Param('id', ParseIntPipe) courierID: number): Promise<Courier> {
    return this.courierService.findOne(courierID);
  }

  @Put('stores/:storeId')
  @ApiUserType('manager')
  updateStore(
    @Param('storeId', ParseIntPipe) storeID: number,
    @Body() params: UpdateStoreFullDto,
  ): Promise<Store> {
    return this.storeService.updateFull(storeID, params);
  }

  @Put('couriers/:courierId')
  @ApiUserType('manager')
  updateCourier(
    @Param('courierId', ParseIntPipe) courierID: number,
    @Body() params: UpdateCourierFullDto,
  ): Promise<Courier> {
    return this.courierService.update(courierID, params);
  }

  @Delete('couriers/:courierId')
  @ApiUserType('manager')
  deleteCourier(
    @Param('courierId', ParseIntPipe) courierID: number,
  ): Promise<boolean> {
    return this.courierService.delete(courierID);
  }

  @Put('customers/:customerId')
  @ApiUserType('manager')
  updateCustomer(
    @Param('customerId', ParseIntPipe) customerID: number,
    @Body() params: UpdateCustomerFullDto,
  ): Promise<Customer> {
    return this.customerService.update(customerID, params);
  }
}
