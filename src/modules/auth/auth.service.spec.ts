import { BadRequestException } from '@nestjs/common';
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

  describe('validateUser', () => {
    // FIXME: it's not perfect way to compare passwords
    // by using seeds.
    const data: LoginDto = {
      email: 'customer_1@gmail.com',
      password: 'password',
      userType: 'customer',
    };

    it('should succeed', async () => {
      const expectData = customerSeed[0];
      userService.findByEmail.mockReturnValueOnce(expectData);
      const result = await service['validateUser'](data);

      expect(result).toEqual(expectData);
    });

    it('should fail on not found user', async () => {
      userService.findByEmail.mockReturnValueOnce(undefined);
      await expect(service['validateUser'](data)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should fail on invalid password', async () => {
      const data: LoginDto = {
        email: 'customer_1@gmail.com',
        password: 'invalid',
        userType: 'customer',
      };
      const expectData = customerSeed[0];

      userService.findByEmail.mockReturnValueOnce(expectData);
      await expect(service['validateUser'](data)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('getToken', () => {
    it('should succeed', async () => {
      service['validateUser'] = jest.fn().mockReturnValueOnce(customerSeed[0]);
      const data: LoginDto = {
        email: 'customer_1@gmail.com',
        password: 'password',
        userType: 'customer',
      };
      const result = await service.getToken(data);

      expect(result).toHaveProperty('accessToken', expect.any(String));
    });
  });

  describe('createCustomer', () => {
    it('should succeed', async () => {
      customerService.create.mockReturnValueOnce(customerSeed[0]);
      const data: CreateCustomerDto = {
        email: 'customer_1@gmail.com',
        password: 'password',
        name: 'Name',
      };
      const result = await service.createCustomer(data);

      expect(result).toHaveProperty('accessToken', expect.any(String));
    });
  });
});
