import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { CreateCustomerDto } from '../auth/dto/auth.dto';
import { CustomerModule } from './customer.module';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepo: Repository<Customer>;
  let conn: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CustomerModule],
      providers: [
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepo = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    conn = module.get<Connection>(Connection);
  });

  afterAll(async () => {
    if (conn) {
      await conn.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const data: CreateCustomerDto = {
      email: 'customer_1@gmail.com',
      password: 'password',
      name: 'customer_1',
    };

    it('should succeed', async () => {
      const expectData = customerRepo.create({
        id: 1,
        email: data.email,
        passwordHash: '6453fd457d2afa55624d55aabf85fe1f',
        passwordSalt: 'cVTjOpkUOa0ngw==',
        status: 'active',
        name: data.name,
      });
      jest.spyOn(customerRepo, 'save').mockResolvedValueOnce(expectData);
      jest.spyOn(service, 'emailExist').mockResolvedValueOnce();

      const result = await service.create(data);
      expect(result).toEqual(expectData);
    });
  });

  describe('find', () => {
    it('should succeed', async () => {
      const expectData = customerRepo.create({
        id: 1,
      });
      jest.spyOn(customerRepo, 'findOne').mockResolvedValueOnce(expectData);
      const result = await service.find(1);

      expect(result).toEqual(expectData);
    });
  });
});
