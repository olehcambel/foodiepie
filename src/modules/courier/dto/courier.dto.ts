import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { LanguageRefDto } from '../../../common/ref-entity.dto';
import {
  Courier,
  statusArray as courierStatus,
} from '../../../entities/courier.entity';
import { Order, statusArray } from '../../../entities/order.entity';
import { boolTransform } from '../../../lib/swagger-dto';

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

const cFields: (keyof Courier)[] = [
  'id',
  'firstName',
  'lastName',
  'imageURL',
  'status',
  'email',
  'description',
];

const cContains: (keyof Courier)[] = ['language'];

export class GetCourierDto {
  @ApiPropertyOptional({ enum: cFields, isArray: true, name: 'fields[]' })
  @IsIn(cFields, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  fields?: (keyof Courier)[];

  @ApiPropertyOptional({ enum: cContains, isArray: true, name: 'contains[]' })
  @IsIn(cContains, { each: true })
  // @ArrayMinSize(1)
  @IsOptional()
  contains?: (keyof Courier)[];
}

export class GetCouriersDto {
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

export class UpdateCourierFullDto implements DeepPartial<AppEntity.Courier> {
  @IsIn(courierStatus)
  @IsOptional()
  status?: AppEntity.CourierStatus;

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

const oFields: (keyof Order)[] = [
  'id',
  'status',
  'description',
  'scheduledDate',
  'isPaid',
  'totalPrice',
  'deliveryPrice',
  'createdAt',
];

const oContains: (keyof Order)[] = [
  'customer',
  'courier',
  'storeLocation',
  'orderAddress',
  'orderItems',
];

class CourierOrdersFilterDto implements DeepPartial<Order> {
  // not supported
  // @ApiPropertyOptional({
  //   enum: statusArray,
  //   name: 'filters[status]',
  // })
  @IsIn(statusArray)
  @IsOptional()
  status: AppEntity.OrderStatus;
}

export class GetCourierOrdersDto {
  @IsOptional()
  @Transform(boolTransform)
  @IsBoolean()
  isSearch?: boolean;

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

  @ApiPropertyOptional({ enum: oFields, isArray: true, name: 'fields[]' })
  @IsIn(oFields, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  fields?: (keyof Order)[];

  @ApiPropertyOptional({ enum: oContains, isArray: true, name: 'contains[]' })
  @ArrayMinSize(1)
  @IsIn(oContains, { each: true })
  @IsOptional()
  contains?: (keyof Order)[];

  @Type(() => CourierOrdersFilterDto)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  filters?: CourierOrdersFilterDto;
}
