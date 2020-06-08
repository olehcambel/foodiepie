import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAGE_LIMIT, PAGE_OFFSET, SALT_LENGTH } from '../../common/constants';
import { Customer } from '../../entities/customer.entity';
import { Order } from '../../entities/order.entity';
import { compareHash, geneHash } from '../../lib/hash';
import { CreateCustomerDto, LoginDto } from '../auth/dto/auth.dto';
import { GetCustomerOrders, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async update(id: number, params: UpdateCustomerDto): Promise<boolean> {
    await this.customerRepo.update(id, params);
    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.customerRepo.update(id, { status: 'deleted' });
    return true;
  }

  find(id: number): Promise<Customer> {
    return this.customerRepo.findOne(id, {
      select: ['id', 'name', 'status', 'email'],
      relations: ['language'],
    });
  }

  async emailExist(email: string): Promise<void> {
    // if (err.code === 'ER_DUP_ENTRY') {
    const isExist =
      (await this.customerRepo
        .createQueryBuilder()
        .where({ email })
        .getCount()) > 0;
    if (isExist) {
      throw new BadRequestException('User already exist');
    }
  }

  async create(params: CreateCustomerDto): Promise<Customer> {
    await this.emailExist(params.email);
    const { hash, salt } = geneHash(params.password, SALT_LENGTH);
    const user = await this.customerRepo.save({
      email: params.email,
      name: params.name,
      passwordHash: hash,
      passwordSalt: salt,
      status: 'active',
      language: params.language,
    });

    return user;
  }

  getOrders(userID: number, params: GetCustomerOrders): Promise<Order[]> {
    return this.orderRepo.find({
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
      select: ['id', 'isPaid', 'price', 'status'],
      where: {
        customer: {
          id: userID,
        },
      },
    });
  }

  async findByCreds(params: LoginDto): Promise<Customer> {
    const userKeys: (keyof Customer)[] = ['id', 'passwordHash', 'passwordSalt'];
    const user = await this.customerRepo
      .createQueryBuilder('c')
      .select(userKeys.map((k) => `c.${k}`))
      .where({ email: params.email })
      .getOne();

    if (
      !user ||
      !compareHash(params.password, user.passwordHash, user.passwordSalt)
    ) {
      throw new BadRequestException('Invalid username/password');
    }

    return user;
  }
}
