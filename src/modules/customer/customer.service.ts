import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGE_LIMIT, PAGE_OFFSET } from 'src/common/constants';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { compareHash } from 'src/lib/hash';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/auth.dto';
import { GetCustomerOrders } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async getOrders(userID: number, params: GetCustomerOrders): Promise<Order[]> {
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
