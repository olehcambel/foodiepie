import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
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

const userType: AppEntity.UserType[] = ['customer', 'courier', 'manager'];
export class LoginDto {
  @IsEmail()
  readonly email: string;

  @Length(8, 18)
  readonly password: string;

  @ApiProperty({ enum: userType })
  @IsIn(userType)
  readonly userType: AppEntity.UserType;
}

export class RefreshTokenDto {
  @IsUUID()
  refreshToken: string;
}
