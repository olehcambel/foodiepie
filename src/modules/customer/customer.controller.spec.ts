import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerModule } from './customer.module';
import { Connection } from 'typeorm';

describe('CustomerController', () => {
  let controller: CustomerController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomerModule],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
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
