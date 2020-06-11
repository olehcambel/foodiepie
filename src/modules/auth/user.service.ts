import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from '../../entities/courier.entity';
import { Customer } from '../../entities/customer.entity';
import { LoginDto } from './dto/auth.dto';
import { Manager } from '../../entities/manager.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,
  ) {}

  getUserRepo(type: AppEntity.UserType): Repository<AppEntity.User> {
    switch (type) {
      case 'customer':
        return this.customerRepo;
      //   break;
      case 'courier':
        return this.courierRepo;
      //   break;
      case 'manager':
        return this.managerRepo;
      //   break;
      default:
        throw new BadRequestException('invalid userType');
    }
  }

  async findByEmail(params: LoginDto): Promise<AppEntity.User | undefined> {
    const userRepo = this.getUserRepo(params.userType);

    return userRepo.findOne({
      select: ['id', 'passwordHash', 'passwordSalt'],
      where: { email: params.email, status: 'active' },
    });
  }
}
