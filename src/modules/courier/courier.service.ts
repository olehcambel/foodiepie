import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindConditions, Repository, IsNull } from 'typeorm';
import { PAGE_LIMIT, PAGE_OFFSET, SALT_LENGTH } from '../../common/constants';
import { Courier } from '../../entities/courier.entity';
import { Order } from '../../entities/order.entity';
import { geneHash } from '../../lib/hash';
import { CouriersResDto } from './dto/courier-res.dto';
import {
  CreateCandidate,
  GetCourierOrdersDto,
  GetCouriersDto,
  GetCourierDto,
} from './dto/courier.dto';
import { OrdersResDto } from '../order/dto/order-res.dto';

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  private isAffected(affected: number): void {
    if (!affected) {
      throw new BadRequestException('failed to update. not found');
    }
  }

  async create(params: CreateCandidate): Promise<number> {
    await this.emailExist(params.email);
    const { hash, salt } = geneHash(params.password, SALT_LENGTH);
    const { id } = await this.courierRepo.save({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phoneNumber: params.phoneNumber,
      passwordHash: hash,
      passwordSalt: salt,
      status: 'pending',
      language: params.language,
    });

    return id;
  }

  findOne(id: number, params: GetCourierDto = {}): Promise<Courier> {
    return this.courierRepo.findOne(id, {
      select: params.fields,
      // temp solution with ||
      //  || [
      //   'id',
      //   'firstName',
      //   'lastName',
      //   'imageURL',
      //   'status',
      //   'email',
      //   'description',
      // ],
      relations: params.contains,
    });
  }

  async find(params: GetCouriersDto = {}): Promise<CouriersResDto> {
    const [data, count] = await this.courierRepo.findAndCount({
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
    });

    return { data, count };
  }

  async update(
    id: number,
    params: DeepPartial<AppEntity.Courier>,
  ): Promise<Courier> {
    const res = await this.courierRepo.update(id, params);
    this.isAffected(res.affected);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.courierRepo.update(id, { status: 'deleted' });
    this.isAffected(res.affected);
    return true;
  }

  async emailExist(email: string): Promise<void> {
    // if (err.code === 'ER_DUP_ENTRY') {
    const isExist =
      (await this.courierRepo
        .createQueryBuilder()
        .where({ email })
        .getCount()) > 0;
    if (isExist) {
      throw new BadRequestException('User already exist');
    }
  }

  async acceptOrder(courierID: number, orderID: number): Promise<Order> {
    const order = await this.orderRepo.findOne(orderID, {
      select: ['id', 'status', 'courierID'],
    });
    if (order.status !== 'scheduled' || order.courierID) {
      throw new BadRequestException('Order is not available to deliver');
    }

    order.status = 'active';
    order.courier = new Courier();
    order.courier.id = courierID;
    await this.orderRepo.save(order);
    return order;
  }

  // TODO: customer data should be available only if status is active
  async getOrders(
    courierID: number,
    params: GetCourierOrdersDto,
  ): Promise<OrdersResDto> {
    const where: FindConditions<Order> = {
      ...params.filters,
    };

    // use status: 'scheduled' (?)
    where.courier = { id: params.isSearch ? IsNull() : courierID };

    const [data, count] = await this.orderRepo.findAndCount({
      select: params.fields,
      relations: params.contains,
      where,
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
    });

    return { data, count };
  }
}
