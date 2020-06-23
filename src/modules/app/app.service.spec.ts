import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Language } from '../../entities/language.entity';
import { seed as languageSeed } from '../../seeds/language.seed';

describe('AppService', () => {
  let service: AppService;
  const languageRepo = {
    find: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Language),
          useValue: languageRepo,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getLangs', async () => {
    languageRepo.find.mockReturnValueOnce(languageSeed);
    const result = await service.getLangs();

    expect(result).toEqual(languageSeed);
  });
});
