import { Type } from 'class-transformer';
import { IsInt, IsOptional, Length, Max, Min } from 'class-validator';

export class CreateCatDto {
  @Length(1, 10)
  readonly name: string;
  readonly age: number;
  readonly breed: string;
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
