import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsIn } from 'class-validator';
import { GetStatCourierResDto } from './stats-res.dto';

type Fields = keyof GetStatCourierResDto;

const fields: Fields[] = [
  'orderCount',
  'orderPayout',
  'averageTime',
  'commonAddress',
];

export class GetStatCourierDto {
  @ApiPropertyOptional({ enum: fields, isArray: true, name: 'fields[]' })
  @ArrayMinSize(1)
  @IsIn(fields, { each: true })
  fields: Fields[];
}
