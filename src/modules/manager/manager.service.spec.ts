import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ManagerModule } from './manager.module';
import { ManagerService } from './manager.service';

describe('ManagerService', () => {
  let conn: Connection;
  let service: ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), ManagerModule],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    service = module.get<ManagerService>(ManagerService);
    conn = module.get<Connection>(Connection);
  });

  afterEach(async () => {
    if (conn) {
      await conn.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
