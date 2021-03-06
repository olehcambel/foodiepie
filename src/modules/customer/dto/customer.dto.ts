import { IsIn, IsOptional, Length } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { statusArray as customerStatus } from '../../../entities/customer.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto implements DeepPartial<AppEntity.Customer> {
  @Length(1, 50)
  @IsOptional()
  name?: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;

  @Length(1, 255)
  @IsOptional()
  imageURL?: string;
}

export class UpdateCustomerFullDto implements DeepPartial<AppEntity.Customer> {
  @ApiProperty({ enum: customerStatus })
  @IsIn(customerStatus)
  @IsOptional()
  status?: AppEntity.CustomerStatus;

  @Length(1, 50)
  @IsOptional()
  name?: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;

  @Length(1, 255)
  @IsOptional()
  imageURL?: string;
}
