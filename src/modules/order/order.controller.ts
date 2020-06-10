import {
  Body,
  Controller,
  Post,
  Req,
  Put,
  Get,
  Param,
  ParseIntPipe,
  Query,
  NotImplementedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from '../../entities/order.entity';
import { OrderCheckoutDto, GetCustomerOrders } from './dto/order.dto';
import { OrderService } from './order.service';
import { ApiUserType } from '../../decorators/user-type.decorator';

@Controller('custumers/orders')
@ApiBearerAuth()
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'create an order' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  checkout(
    @Req() req: JWTReq.Customer,
    @Body() params: OrderCheckoutDto,
  ): Promise<Order> {
    return this.service.checkout(req.user.id, params);
  }

  @Get()
  @ApiUserType('customer')
  getOrders(
    @Query() params: GetCustomerOrders,
    @Req() req: JWTReq.Customer,
  ): Promise<Order[]> {
    return this.service.getOrders(req.user.id, params);
  }

  @Get('receipt/estimation')
  calcReceipt(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put(':orderId/cancel')
  cancelOrder(
    @Req() req: JWTReq.Customer,
    @Param('orderId', ParseIntPipe) orderID: number,
  ): Promise<boolean> {
    return this.service.cancelOrder(req.user.id, orderID);
  }
}
