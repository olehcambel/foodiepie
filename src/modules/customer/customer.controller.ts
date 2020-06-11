import { Body, Controller, Delete, Get, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUserType } from '../../decorators/user-type.decorator';
import { Customer } from '../../entities/customer.entity';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/customer.dto';

@Controller('customers')
@ApiBearerAuth()
@ApiTags('Customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('me')
  @ApiUserType('customer')
  getUser(@Req() req: JWTReq.User): Promise<Customer> {
    return this.service.find(req.user.id);
  }

  @Delete('me')
  @ApiUserType('customer')
  deleteUser(@Req() req: JWTReq.User): Promise<boolean> {
    return this.service.delete(req.user.id);
  }

  @Put('me')
  @ApiUserType('customer')
  updateUser(
    @Req() req: JWTReq.User,
    @Body() params: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.service.update(req.user.id, params);
  }
}
