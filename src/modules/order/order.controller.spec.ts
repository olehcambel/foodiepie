import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { OrderController } from './order.controller';
import { OrderModule } from './order.module';

describe('OrderController', () => {
  let controller: OrderController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), OrderModule],
    }).compile();

    controller = module.get<OrderController>(OrderController);
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
