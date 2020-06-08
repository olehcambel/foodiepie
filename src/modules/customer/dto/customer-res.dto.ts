import { ApiProperty } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';
import { statusArray } from '../../../entities/customer.entity';

export class CustomerDto implements DeepPartial<AppEntity.Customer> {
  id: number;

  name: string;

  @ApiProperty({ enum: statusArray })
  status: AppEntity.CustomerStatus;

  email: string;

  description: string;
}
