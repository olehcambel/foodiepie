import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDecimal,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsObject,
  IsOptional,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { LanguageRefDto } from '../../../common/ref-entity.dto';
import { ProductTranslation } from '../../../entities/product-translation.entity';
import { Product } from '../../../entities/product.entity';
import { StoreLocation } from '../../../entities/store-location.entity';
import {
  Store,
  statusArray as storeStatus,
} from '../../../entities/store.entity';

class StoreLocationDto implements DeepPartial<StoreLocation> {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @Length(1, 100)
  address: string;

  // @IsPostalCode()
  @Length(5, 10)
  postalCode: string;
}

export class CreateStoreDto implements DeepPartial<Store> {
  @Length(1, 50)
  title: string;

  @Length(1, 50)
  slug: string;

  @Length(1, 4096)
  @IsOptional()
  description?: string;

  @Type(() => StoreLocationDto)
  @ValidateNested()
  readonly location: StoreLocationDto;
}

const fields: (keyof Store)[] = [
  'createdAt',
  'slug',
  'description',
  'id',
  'title',
];

const contain: (keyof Store)[] = ['location'];

export class GetStoresDto {
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
  fields?: (keyof Store)[];

  @ApiPropertyOptional({ enum: contain, isArray: true, name: 'contain[]' })
  @ArrayMinSize(1)
  @IsIn(contain, { each: true })
  @IsOptional()
  contains?: (keyof Store)[];
}

export class UpdateStoreDto implements DeepPartial<Store> {
  @Length(1, 4096)
  @IsOptional()
  description?: string;
}

export class UpdateStoreFullDto implements DeepPartial<Store> {
  @Length(1, 50)
  @IsOptional()
  title?: string;

  @Length(1, 50)
  @IsOptional()
  slug?: string;

  @IsIn(storeStatus)
  @IsOptional()
  status?: AppEntity.StoreStatus;

  @Length(1, 4096)
  @IsOptional()
  description?: string;
}

class ProductTranslationDto implements DeepPartial<ProductTranslation> {
  @Length(1, 50)
  title: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;

  @Type(() => LanguageRefDto)
  @ValidateNested()
  @IsObject()
  language: LanguageRefDto;
}

class SaveProduct implements DeepPartial<Product> {
  // @Expose({ name: 'externalId' })
  @Length(1, 50)
  externalID: string;

  @Length(1, 255)
  @IsOptional()
  imageURL?: string;

  @IsDecimal()
  price: string;

  @Type(() => ProductTranslationDto)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @ArrayMaxSize(10)
  translations: ProductTranslationDto[];
}

export class SaveProductsDto {
  @Type(() => SaveProduct)
  @ValidateNested({ each: true })
  @IsObject({ each: true })
  @ArrayMaxSize(100)
  data: SaveProduct[];
}
