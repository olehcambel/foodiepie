import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDateString,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { OrderAddress } from '../../../entities/order-address.entity';
import { OrderItem } from '../../../entities/order-item.entity';
import { Order } from '../../../entities/order.entity';
import { RefDto } from '../../../common/ref-entity.dto';

class OrderAddressDto implements DeepPartial<OrderAddress> {
  @Length(1, 100)
  address: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}

class OrderItemDto implements DeepPartial<OrderItem> {
  @IsInt()
  id: number;

  @Min(1)
  @Max(100)
  quantity: number;
}

export class OrderCheckoutDto implements DeepPartial<Order> {
  @Length(1, 255)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      "If you want the order to be scheduled. Otherwise, it'll be scheduled for immediate delivery.",
  })
  @IsDateString()
  @IsOptional()
  scheduledDate?: Date;

  @Type(() => RefDto)
  @ValidateNested()
  storeLocation: RefDto;

  @Type(() => OrderAddressDto)
  @ValidateNested()
  orderAddress: OrderAddressDto;

  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @Type(() => OrderItemDto)
  @ValidateNested({ each: true })
  products: OrderItemDto[];
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
  // @IsIn(fields, { each: true })
  // @IsOptional()
  // fields?: (keyof AppEntity.Order)[];
}
