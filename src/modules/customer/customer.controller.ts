import { Controller, Get, Put, Query, Req, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUserType } from '../../decorators/user-type.decorator';
import { CustomerService } from './customer.service';
import { GetCustomerOrders, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from '../../entities/customer.entity';
import { Order } from '../../entities/order.entity';

@Controller('customers')
@ApiBearerAuth()
@ApiTags('Customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('orders')
  @ApiUserType('customer')
  getOrders(
    @Query() params: GetCustomerOrders,
    @Req() req: JWTReq.Customer,
  ): Promise<Order[]> {
    return this.service.getOrders(req.user.id, params);
  }

  @Get('me')
  @ApiUserType('customer')
  getUser(@Req() req: JWTReq.Customer): Promise<Customer> {
    return this.service.find(req.user.id);
  }

  @Delete('me')
  @ApiUserType('customer')
  deleteUser(@Req() req: JWTReq.Customer): Promise<boolean> {
    return this.service.delete(req.user.id);
  }

  @Put('me')
  @ApiUserType('customer')
  updateUser(
    @Req() req: JWTReq.Customer,
    @Body() params: UpdateCustomerDto,
  ): Promise<boolean> {
    return this.service.update(req.user.id, params);
  }

  // @Post('signup')
  // createUser() {}

  // @Get()
  // getHello(): string {
  //   return this.service.getHello();
  // }

  // @Post()
  // @ApiOperation({ summary: 'Create cat' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
  //   return this.service.create(createCatDto);
  // }
}
