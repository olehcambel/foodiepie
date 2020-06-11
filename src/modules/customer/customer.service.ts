import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SALT_LENGTH } from '../../common/constants';
import { Customer } from '../../entities/customer.entity';
import { geneHash } from '../../lib/hash';
import { CreateCustomerDto } from '../auth/dto/auth.dto';
import { UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async update(id: number, params: UpdateCustomerDto): Promise<Customer> {
    await this.customerRepo.update(id, params);
    // TODO: add parameter { returnValue: bool } -> true or data
    return this.find(id);
    // return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.customerRepo.update(id, { status: 'deleted' });
    return true;
  }

  find(id: number): Promise<Customer> {
    return this.customerRepo.findOne(id, {
      select: ['id', 'name', 'status', 'email', 'description', 'imageURL'],
      relations: ['language'], // stores
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
}
