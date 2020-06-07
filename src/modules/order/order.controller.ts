import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from 'src/entities/order.entity';
import { OrderCheckoutDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('orders')
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
}
