import { Type } from 'class-transformer';
import { IsInt, IsOptional, Length, Max, Min } from 'class-validator';
import { DeepPartial } from 'typeorm';

export class UpdateCustomerDto implements DeepPartial<AppEntity.Customer> {
  @Length(1, 50)
  @IsOptional()
  name?: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;
}

// TODO: if status is active -> add courier info
// const fields: (keyof AppEntity.Order)[] = [
//   'description',
//   'scheduledDate',
//   'price',
//   'status',
//   'currency',
//   'storeAddress',
//   'orderAddress',
// ];

export class GetCustomerOrders {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10000)
  @Type(() => Number)
  offset?: number;

  // @ApiPropertyOptional({ enum: fields, isArray: true, name: 'fields[]' })
  // @IsOptional()
  // @IsIn(fields, { each: true })
  // @IsOptional()
  // fields?: (keyof AppEntity.Order)[];
}
