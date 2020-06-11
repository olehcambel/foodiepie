import {
  Controller,
  Get,
  NotImplementedException,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { ApiUserType } from '../../decorators/user-type.decorator';

@Controller('managers')
@ApiTags('Manager')
@ApiBearerAuth()
export class ManagerController {
  constructor(private readonly service: ManagerService) {}

  @Get('couriers')
  @ApiUserType('manager')
  getCouriers(): Promise<void> {
    throw new NotImplementedException();
  }

  @Get('couriers/:courierId')
  @ApiUserType('manager')
  getCourier(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('couriers/:courierId')
  @ApiUserType('manager')
  updateCourier(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('couriers/:courierId')
  @ApiUserType('manager')
  deleteCourier(
    @Query('courierId', ParseIntPipe) courierID: number,
  ): Promise<boolean> {
    return this.service.deleteCourier(courierID);
  }

  @Put('customers/:customerId')
  @ApiUserType('manager')
  updateCustomer(): Promise<void> {
    throw new NotImplementedException();
  }
}
