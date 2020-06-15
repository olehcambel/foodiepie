import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../entities/language.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [AppService],
  controllers: [AppController],
})
export class PrefixlessModule {}
