import { Test, TestingModule } from '@nestjs/testing';
import { seed as customerSeed } from '../../seeds/customer.seed';
import { CustomerService } from '../customer/customer.service';
import { AuthService } from './auth.service';
import { CreateCustomerDto, LoginDto } from './dto/auth.dto';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  const customerService = {
    create: jest.fn(),
  };
  const userService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: CustomerService,
          useValue: customerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createCustomer', async () => {
    customerService.create.mockReturnValueOnce(customerSeed[0]);
    const data: CreateCustomerDto = {
      email: 'customer_1@gmail.com',
      password: 'password',
      name: 'Name',
    };
    const result = await service.createCustomer(data);

    expect(result).toHaveProperty('accessToken', expect.any(String));
  });

  describe('getToken', () => {
    it('should succeed', async () => {
      userService.findByEmail.mockReturnValueOnce(customerSeed[0]);
      const data: LoginDto = {
        email: 'customer_1@gmail.com',
        password: 'password',
        userType: 'customer',
      };
      const result = await service.getToken(data);

      expect(result).toHaveProperty('accessToken', expect.any(String));
    });
  });
});
