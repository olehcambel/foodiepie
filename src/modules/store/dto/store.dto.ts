import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsPostalCode,
  Length,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { StoreRefDto, StoreTypeRefDto } from '../../../common/ref-entity.dto';
import { StoreAddress } from '../../../entities/store-address.entity';
import { Store } from '../../../entities/store.entity';

export class CreateStoreAddressDto implements DeepPartial<StoreAddress> {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @Length(1, 100)
  address: string;

  @IsPostalCode()
  postalCode: string;

  @Type(() => StoreRefDto)
  @ValidateNested()
  store: StoreRefDto;
}

export class CreateStoreDto implements DeepPartial<Store> {
  @Length(1, 50)
  name: string;

  @Length(1, 50)
  slug: string;

  @Length(1, 4096)
  @IsOptional()
  description?: string;

  @Type(() => StoreTypeRefDto)
  @ValidateNested()
  storeType: StoreTypeRefDto;
}
