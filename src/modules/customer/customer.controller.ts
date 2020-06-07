import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUserType } from 'src/decorators/user-type.decorator';
import { Order } from 'src/entities/order.entity';
import { CustomerService } from './customer.service';
import { GetCustomerOrders } from './dto/customer.dto';

@Controller('customer')
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
