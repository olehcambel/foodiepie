import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsModule } from './stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

describe('StatsController', () => {
  let controller: StatsController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), StatsModule],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    conn = module.get<Connection>(Connection);
  });

  afterEach(async () => {
    if (conn) {
      await conn.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
