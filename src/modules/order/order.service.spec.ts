import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { OrderModule } from './order.module';
import { OrderService } from './order.service';

describe('OrderService', () => {
  // TODO: MV to separate file -> fixtures and implement class interface
  const customerService = {
    create: () => {
      return {
        id: 1,
        passwordHash: '6453fd457d2afa55624d55aabf85fe1f',
        passwordSalt: 'cVTjOpkUOa0ngw==',
      };
    },
  };

  let conn: Connection;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), OrderModule],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    service = module.get<OrderService>(OrderService);
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
