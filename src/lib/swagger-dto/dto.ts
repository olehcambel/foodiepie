import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ParamId {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  id: number;
}
