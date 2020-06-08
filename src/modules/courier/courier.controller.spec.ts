import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourierController } from './courier.controller';
import { CourierModule } from './courier.module';
import { Connection } from 'typeorm';

describe('CourierController', () => {
  let controller: CourierController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CourierModule],
    }).compile();

    controller = module.get<CourierController>(CourierController);
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
