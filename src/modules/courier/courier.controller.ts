import {
  Controller,
  Post,
  Body,
  Get,
  NotImplementedException,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourierService } from './courier.service';
import { Courier } from '../../entities/courier.entity';
import { CreateCandidate } from './dto/courier.dto';
import { Public } from '../../decorators/access.decorator';

@Controller('couriers')
@ApiBearerAuth()
@ApiTags('Courier')
export class CourierController {
  constructor(private readonly service: CourierService) {}

  @Post('candidates')
  @Public()
  createCandidate(@Body() params: CreateCandidate): Promise<Courier> {
    return this.service.create(params);
  }

  @Get('orders')
  getOrders(): Promise<void> {
    throw new NotImplementedException();
  }

  @Post('orders/:orderId/accept')
  acceptOrder(): Promise<void> {
    throw new NotImplementedException();
  }

  @Get('me')
  getMe(): Promise<void> {
    throw new NotImplementedException();
  }

  @Put('me')
  updateMe(): Promise<void> {
    throw new NotImplementedException();
  }
}
