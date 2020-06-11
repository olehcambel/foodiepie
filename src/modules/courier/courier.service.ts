import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { SALT_LENGTH, PAGE_LIMIT, PAGE_OFFSET } from '../../common/constants';
import { Courier } from '../../entities/courier.entity';
import { geneHash } from '../../lib/hash';
import {
  CreateCandidate,
  GetCourierOrdersDto,
  UpdateCourierDto,
} from './dto/courier.dto';
import { Order } from '../../entities/order.entity';

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

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

  async update(id: number, params: UpdateCourierDto): Promise<Courier> {
    await this.courierRepo.update(id, params);
    return this.find(id);
  }

  find(id: number): Promise<Courier> {
    return this.courierRepo.findOne(id, {
      select: [
        'id',
        'firstName',
        'lastName',
        'imageURL',
        'status',
        'email',
        'description',
      ],
      relations: ['language'],
    });
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

  getOrders(courierID: number, params: GetCourierOrdersDto): Promise<Order[]> {
    const where: FindConditions<Order> = {
      ...params.filters,
      courier: { id: courierID },
    };
    return this.orderRepo.find({
      select: params.fields,
      relations: params.contains,
      where,
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
    });
  }
}
