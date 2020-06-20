import { Test, TestingModule } from '@nestjs/testing';
import { seed as languageSeed } from '../../seeds/language.seed';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getLangs: jest.fn().mockImplementation(() => languageSeed),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLangs', () => {
    it('should succeed', async () => {
      const result = await controller.getLangs();
      expect(result).toEqual([
        {
          id: 1,
          code: 'en',
        },
        {
          id: 2,
          code: 'ru',
        },
        {
          id: 3,
          code: 'fr',
        },
      ]);
    });
  });
});
