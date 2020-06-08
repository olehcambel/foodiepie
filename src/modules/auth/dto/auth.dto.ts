import {
  Length,
  IsEmail,
  IsUUID,
  ValidateNested,
  IsOptional,
  IsInt,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Type } from 'class-transformer';

class LanguageDto {
  @IsInt()
  id: number;
}

export class CreateCustomerDto implements DeepPartial<AppEntity.Customer> {
  @Length(1, 50)
  name: string;

  @IsEmail()
  email: string;

  @Length(8, 18)
  password: string;

  @Type(() => LanguageDto)
  @ValidateNested()
  @IsOptional()
  language?: LanguageDto;
}
export class LoginDto {
  @IsEmail()
  readonly email: string;

  @Length(8, 18)
  readonly password: string;
}

export class RefreshTokenDto {
  @IsUUID()
  refreshToken: string;
}
