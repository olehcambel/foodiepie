import { IsInt } from 'class-validator';

export class LanguageRefDto {
  @IsInt()
  id: number;
}

export class StoreRefDto {
  @IsInt()
  id: number;
}
