import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { seed } from '../../seeds/customer.seed';
import { CreateCustomerDto } from '../auth/dto/auth.dto';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepo: Repository<Customer>;

  // only base methods
  const mockRepo = {
    save() {
      return seed[0];
    },
    findOne(id: number) {
      return seed[id - 1];
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepo = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
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

    it('with new email', async () => {
      customerRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(0),
      });

      const result = await service.create(data);

      expect(result).toEqual(seed[0]);
    });

    it('throw on exist email', async () => {
      const getCountSpy = jest.fn().mockReturnValueOnce(1);
      customerRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getCount: getCountSpy,
      });
      await expect(service.create(data)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should succeed', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(result).toEqual(seed[id - 1]);
    });
  });

  describe('update', () => {
    it('should succeed', async () => {
      const id = 1;
      customerRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });
      const result = await service.update(id, {
        status: 'blocked',
        name: 'newName',
      });

      expect(result).toEqual(seed[id - 1]);
    });
  });

  describe('delete', () => {
    it('should succeed', async () => {
      customerRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toEqual(true);
    });

    it('should fail on not found', async () => {
      customerRepo.update = jest.fn().mockReturnValueOnce({ affected: 0 });

      await expect(service.delete(1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
