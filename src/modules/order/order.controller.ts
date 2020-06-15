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
  ApiNotImplementedResponse,
} from '@nestjs/swagger';
import { Order } from '../../entities/order.entity';
import { OrderCheckoutDto, GetCustomerOrders } from './dto/order.dto';
import { OrderService } from './order.service';
import { ApiUserType } from '../../decorators/user-type.decorator';

@Controller('customers/orders')
@ApiBearerAuth()
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Create an order for delivery.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiUserType('customer')
  checkout(
    @Req() req: JWTReq.User,
    @Body() params: OrderCheckoutDto,
  ): Promise<Order> {
    return this.service.checkout(req.user.id, params);
  }

  @Get()
  @ApiUserType('customer')
  @ApiOperation({ summary: 'Retrieve a list of orders.' })
  getOrders(
    @Query() params: GetCustomerOrders,
    @Req() req: JWTReq.User,
  ): Promise<Order[]> {
    return this.service.getOrders(req.user.id, params);
  }

  @Get('receipt/estimation')
  @ApiUserType('customer')
  @ApiOperation({ summary: 'Provide a price estimation for an order.' })
  @ApiNotImplementedResponse({ description: 'NYI' })
  calcReceipt(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put(':orderId/cancel')
  @ApiUserType('customer')
  @ApiOperation({
    summary: 'Cancel a scheduled order. Active orders cannot be canceled.',
  })
  cancelOrder(
    @Req() req: JWTReq.User,
    @Param('orderId', ParseIntPipe) orderID: number,
  ): Promise<boolean> {
    return this.service.cancelOrder(req.user.id, orderID);
  }
}
