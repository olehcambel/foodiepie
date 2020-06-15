import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/access.decorator';
import { GetStatCourierResDto } from './dto/stats-res.dto';
import { GetStatCourierDto } from './dto/stats.dto';
import { StatsService } from './stats.service';
import { ApiUserType } from '../../decorators/user-type.decorator';

@Controller('stats')
@Public()
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('couriers/:id')
  @ApiUserType('manager')
  getCourier(
    @Param('id', ParseIntPipe) id: number,
    @Param() query: GetStatCourierDto,
  ): Promise<GetStatCourierResDto> {
    return this.service.getCourier(id, query.fields);
  }
}
