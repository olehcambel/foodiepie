import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Courier } from '../../entities/courier.entity';
import { Customer } from '../../entities/customer.entity';
import { Manager } from '../../entities/manager.entity';
import { seed as customerSeed } from '../../seeds/customer.seed';
import { UserService } from './user.service';

describe('UserService', () => {
  const managerRepo = {
    findOne: jest.fn(),
  };

  const customerRepo = {
    findOne: jest.fn(),
  };

  const courierRepo = {
    findOne: jest.fn(),
  };

  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Manager),
          useValue: managerRepo,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: customerRepo,
        },
        {
          provide: getRepositoryToken(Courier),
          useValue: courierRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserRepo', () => {
    it('should fail on invalid', () => {
      const delegate = (): void => {
        service.getUserRepo('invalid' as any);
      };
      expect(delegate).toThrow(BadRequestException);
    });

    it('should get customer', () => {
      const result = service.getUserRepo('customer');

      expect(result).toBeDefined();
    });

    it('should get manager', () => {
      const result = service.getUserRepo('manager');

      expect(result).toBeDefined();
    });

    it('should get courier', () => {
      const result = service.getUserRepo('courier');

      expect(result).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('should find', async () => {
      jest
        .spyOn(customerRepo, 'findOne')
        .mockImplementationOnce(() => customerSeed[0]);
      const result = await service.findByEmail({
        email: 'email',
        password: 'password',
        userType: 'customer',
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('passwordHash');
      expect(result).toHaveProperty('passwordSalt');
    });

    it('should not find', async () => {
      jest
        .spyOn(customerRepo, 'findOne')
        .mockImplementationOnce(() => undefined);
      const result = await service.findByEmail({
        email: 'email',
        password: 'password',
        userType: 'customer',
      });

      expect(result).toBeUndefined();
    });
  });
});
