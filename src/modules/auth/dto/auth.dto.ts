import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { LanguageRefDto } from '../../../common/ref-entity.dto';

export class CreateCustomerDto implements DeepPartial<AppEntity.Customer> {
  @Length(1, 50)
  name: string;

  @IsEmail()
  email: string;

  @Length(8, 18)
  password: string;

  @Type(() => LanguageRefDto)
  @ValidateNested()
  @IsOptional()
  language?: LanguageRefDto;
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
