import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../decorators/access.decorator';
import { ApiUserType } from '../../decorators/user-type.decorator';
import { Courier } from '../../entities/courier.entity';
import { Order } from '../../entities/order.entity';
import { CourierService } from './courier.service';
import {
  CreateCandidate,
  GetCourierOrdersDto,
  UpdateCourierDto,
} from './dto/courier.dto';

@Controller('couriers')
@ApiBearerAuth()
@ApiTags('Courier')
export class CourierController {
  constructor(private readonly service: CourierService) {}

  @Post('candidates')
  @ApiOperation({ summary: 'Register for an courier job.' })
  @Public()
  createCandidate(@Body() params: CreateCandidate): Promise<number> {
    return this.service.create(params);
  }

  @Get('orders')
  @ApiUserType('courier')
  getOrders(
    @Query() params: GetCourierOrdersDto,
    @Req() req: JWTReq.User,
  ): Promise<Order[]> {
    return this.service.getOrders(req.user.id, params);
  }

  @Put('orders/:orderId/accept')
  @ApiOperation({ summary: 'Accept an order. Available if courierId is null' })
  @ApiUserType('courier')
  acceptOrder(
    @Query('orderId', ParseIntPipe) orderID: number,
    @Req() req: JWTReq.User,
  ): Promise<Order> {
    return this.service.acceptOrder(req.user.id, orderID);
  }

  @Get('me')
  @ApiUserType('courier')
  getMe(@Req() req: JWTReq.User): Promise<Courier> {
    return this.service.find(req.user.id);
  }

  @Put('me')
  @ApiUserType('courier')
  updateMe(
    @Req() req: JWTReq.User,
    @Body() params: UpdateCourierDto,
  ): Promise<Courier> {
    return this.service.update(req.user.id, params);
  }
}
