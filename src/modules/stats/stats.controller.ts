import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/access.decorator';
import { GetStatCourierResDto } from './dto/stats-res.dto';
import { GetStatCourierDto } from './dto/stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
@Public()
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('couriers/:id')
  // @ApiUserType()
  getCourier(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetStatCourierDto,
  ): Promise<GetStatCourierResDto> {
    return this.service.getCourier(id, query.fields);
  }
  // getOrders(
  //   @Query() params: GetCustomerOrders,
  //   @Req() req: JWTReq.User,
  // ): Promise<Order[]> {
  //   return this.service.getOrders(req.user.id, params);
  // }
}
