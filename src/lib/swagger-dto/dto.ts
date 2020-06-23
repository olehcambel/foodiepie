import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ParamId {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  id: number;
}

export const boolTransform = (value: unknown): boolean | unknown => {
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }

  return value;
  // throw new BadRequestException('boolean string is expected');
};
