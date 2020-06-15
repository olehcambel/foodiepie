import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../entities/language.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {}

  getLangs(): Promise<Language[]> {
    return this.languageRepo.find();
  }
}
