import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { OrderAddress } from '../../../entities/order-address.entity';
import { OrderItem } from '../../../entities/order-item.entity';
import { Order } from '../../../entities/order.entity';

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
  quantity: number;
}

export class OrderCheckoutDto implements DeepPartial<Order> {
  @Length(1, 255)
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledDate?: Date;

  @Type(() => OrderAddressDto)
  @ValidateNested()
  orderAddress: OrderAddressDto;

  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @Type(() => OrderItemDto)
  @IsArray()
  products: OrderItemDto[];
}
