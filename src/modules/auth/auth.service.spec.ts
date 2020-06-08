import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from './dto/auth.dto';

describe('AuthService', () => {
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
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), AuthModule],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    service = module.get<AuthService>(AuthService);
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

  it('createCustomer', async () => {
    const data: CreateCustomerDto = {
      email: 'customer_1@gmail.com',
      password: 'password',
      name: 'customer_1',
    };
    const result = await service.createCustomer(data);

    expect(result).toHaveProperty('accessToken');
  });
});
