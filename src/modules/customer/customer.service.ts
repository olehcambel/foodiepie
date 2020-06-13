import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { SALT_LENGTH } from '../../common/constants';
import { Customer } from '../../entities/customer.entity';
import { geneHash } from '../../lib/hash';
import { CreateCustomerDto } from '../auth/dto/auth.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  private isAffected(affected: number): void {
    if (!affected) {
      throw new BadRequestException('failed to update. not found');
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

  findOne(id: number): Promise<Customer> {
    return this.customerRepo.findOne(id, {
      select: ['id', 'name', 'status', 'email', 'description', 'imageURL'],
      relations: ['language'], // stores
    });
  }

  async update(
    id: number,
    params: DeepPartial<AppEntity.Customer>,
  ): Promise<Customer> {
    const res = await this.customerRepo.update(id, params);
    this.isAffected(res.affected);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.customerRepo.update(id, { status: 'deleted' });
    this.isAffected(res.affected);
    return true;
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
}
