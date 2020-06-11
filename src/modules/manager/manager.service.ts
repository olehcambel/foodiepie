import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from '../../entities/courier.entity';

@Injectable()
export class ManagerService {
  constructor(
    // @InjectRepository(Manager)
    // private readonly managerRepo: Repository<Manager>,
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,
  ) {}

  async deleteCourier(id: number): Promise<boolean> {
    await this.courierRepo.update(id, { status: 'deleted' });
    return true;
  }
}
