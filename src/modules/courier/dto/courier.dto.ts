import { Type } from 'class-transformer';
import { IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { LanguageRefDto } from '../../../common/ref-entity.dto';
import { Courier } from '../../../entities/courier.entity';

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
