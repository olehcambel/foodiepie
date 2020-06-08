import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { GetStatCourierDto } from './dto/stats.dto';
import { ParamId } from '../../lib/swagger-dto';
import { GetStatCourierResDto } from './dto/stats-res.dto';

@Controller('stats')
@ApiBearerAuth()
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('couriers/:id')
  // @ApiUserType()
  getCourier(
    @Param() { id }: ParamId,
    @Query() query: GetStatCourierDto,
  ): Promise<GetStatCourierResDto> {
    return this.service.getCourier(id, query.fields);
  }
  // getOrders(
  //   @Query() params: GetCustomerOrders,
  //   @Req() req: JWTReq.Customer,
  // ): Promise<Order[]> {
  //   return this.service.getOrders(req.user.id, params);
  // }
}
