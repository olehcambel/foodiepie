import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { StoreController } from './store.controller';
import { StoreModule } from './store.module';

describe('StoreController', () => {
  let controller: StoreController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), StoreModule],
    }).compile();

    controller = module.get<StoreController>(StoreController);
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
