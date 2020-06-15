import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Language } from '../../entities/language.entity';
import { AppService } from './app.service';

@Controller('app')
@ApiTags('App')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('langs')
  getLangs(): Promise<Language[]> {
    return this.service.getLangs();
  }
}
