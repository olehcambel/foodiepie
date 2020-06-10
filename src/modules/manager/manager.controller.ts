import { Controller, Get, NotImplementedException, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('managers')
@ApiTags('Manager')
export class ManagerController {
  // constructor(private readonly service: ManagerService) {}

  @Get('couriers')
  getCouriers(): Promise<void> {
    throw new NotImplementedException();
  }

  @Get('couriers/:courierId')
  getCourier(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('couriers/:courierId')
  updateCourier(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('couriers/:courierId')
  deleteCourier(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('customers/:customerId')
  updateCustomer(): Promise<void> {
    throw new NotImplementedException();
  }
}
