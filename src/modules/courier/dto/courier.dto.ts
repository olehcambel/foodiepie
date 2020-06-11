import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  Length,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsIn,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { LanguageRefDto } from '../../../common/ref-entity.dto';
import { Courier } from '../../../entities/courier.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Order, statusArray } from '../../../entities/order.entity';

export class CreateCandidate implements DeepPartial<Courier> {
  @IsEmail()
  email: string;

  @Length(1, 50)
  firstName: string;

  @Length(1, 50)
  lastName: string;

  @Length(1, 20)
  phoneNumber: string;

  @Length(8, 18)
  password: string;

  @Type(() => LanguageRefDto)
  @ValidateNested()
  @IsOptional()
  language?: LanguageRefDto;
}

export class UpdateCourierDto implements DeepPartial<AppEntity.Courier> {
  @Length(1, 50)
  @IsOptional()
  firstName?: string;

  @Length(1, 50)
  @IsOptional()
  lastName?: string;

  @Length(1, 255)
  @IsOptional()
  imageURL?: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;
}

const fields: (keyof Order)[] = [
  'id',
  'status',
  'description',
  'scheduledDate',
  'isPaid',
  'totalPrice',
  'deliveryPrice',
  'createdAt',
];

const contain: (keyof Order)[] = [
  'customer',
  'storeLocation',
  'orderAddress',
  'orderItems',
];

class CourierOrdersFilterDto implements DeepPartial<Order> {
  @ApiPropertyOptional({
    enum: statusArray,
    isArray: true,
    name: 'filters[status]',
  })
  @IsIn(statusArray, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  status: AppEntity.OrderStatus;
}

export class GetCourierOrdersDto {
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

  @ApiPropertyOptional({ enum: fields, isArray: true, name: 'fields[]' })
  @IsIn(fields, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  fields?: (keyof Order)[];

  @ApiPropertyOptional({ enum: contain, isArray: true, name: 'contain[]' })
  @ArrayMinSize(1)
  @IsIn(contain, { each: true })
  @IsOptional()
  contains?: (keyof Order)[];

  @Type(() => CourierOrdersFilterDto)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  filters?: CourierOrdersFilterDto;
}
