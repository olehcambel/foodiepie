import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { GetStatCourierResDto } from './dto/stats-res.dto';
import { OrderAddress } from '../../entities/order-address.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(OrderAddress)
    private readonly orderAddressRepo: Repository<OrderAddress>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // async qtest(id: number, fields: string[]): Promise<GetStatCourierResDto> {
  //   // fields: 'orderCount', 'orderPayout', 'averageTime', 'commonAddress',
  //   //
  //   //
  // }

  async getCourier(
    id: number,
    fields: string[],
  ): Promise<GetStatCourierResDto> {
    const [perf, common] = await Promise.all([
      this.getCourierPerf(id, fields),
      this.getCommonAddress(id, fields),
    ]);

    const result: GetStatCourierResDto = {};
    if (perf) {
      Object.assign(result, perf);
    }

    if (common) {
      Object.assign(result, common);
    }

    return result;
  }

  private async getCourierPerf(
    id: number,
    fields: string[],
  ): Promise<void | GetStatCourierResDto> {
    const selection: string[] = [];

    if (fields.includes('orderCount')) {
      selection.push('count(*) as orderCount');
    }

    if (fields.includes('orderPayout')) {
      selection.push('sum(o.totalPrice) as orderPayout');
    }

    if (fields.includes('averageTime')) {
      selection.push(
        'sec_to_time(avg(time_to_sec(timediff(o.finishedAt, o.scheduledDate)))) as averageTime',
        // 'avg(time_to_sec(timediff(o.finishedAt, o.scheduledDate))) as averageTime',
      );
    }

    if (!selection.length) return;
    const builder = this.orderRepo
      .createQueryBuilder('o')
      .innerJoin('o.courier', 'c')
      .where('c.id = :id', { id })
      .andWhere('o.status = :status', { status: 'delivered' });

    builder.select(selection);
    return builder.getRawOne();
  }

  private async getCommonAddress(
    id: number,
    fields: string[],
  ): Promise<void | GetStatCourierResDto> {
    if (!fields.includes('commonAddress')) {
      return;
    }

    return this.orderAddressRepo
      .createQueryBuilder('oA')
      .select('oA.address', 'commonAddress')
      .innerJoin('oA.order', 'o')
      .innerJoin('o.courier', 'c')
      .where('c.id = :id', { id })
      .andWhere('o.status = :status', { status: 'delivered' })
      .groupBy('oA.address')
      .orderBy('count(*)', 'DESC')
      .getRawOne();
  }
}
