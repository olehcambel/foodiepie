import { IsOptional, Length } from 'class-validator';
import { DeepPartial } from 'typeorm';

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
