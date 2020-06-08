import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourierService } from './courier.service';
import { Courier } from '../../entities/courier.entity';
import { CreateCandidate } from './dto/courier.dto';

@Controller('couriers')
@ApiBearerAuth()
@ApiTags('Courier')
export class CourierController {
  constructor(private readonly service: CourierService) {}

  @Post('candidates')
  createCandidate(@Body() params: CreateCandidate): Promise<Courier> {
    return this.service.create(params);
  }
}
