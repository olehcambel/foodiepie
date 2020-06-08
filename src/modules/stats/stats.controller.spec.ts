import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsModule } from './stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), StatsModule],
    }).compile();

    controller = app.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
