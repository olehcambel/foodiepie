import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SALT_LENGTH } from '../../common/constants';
import { Courier } from '../../entities/courier.entity';
import { geneHash } from '../../lib/hash';
import { CreateCandidate } from './dto/courier.dto';

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,
  ) {}

  async create(params: CreateCandidate): Promise<Courier> {
    await this.emailExist(params.email);
    const { hash, salt } = geneHash(params.password, SALT_LENGTH);
    const user = await this.courierRepo.save({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      passwordHash: hash,
      passwordSalt: salt,
      status: 'pending',
      language: params.language,
    });

    return user;
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
}
