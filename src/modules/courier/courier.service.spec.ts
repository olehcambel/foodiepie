import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PAGE_OFFSET, PAGE_LIMIT } from '../../common/constants';
import { Courier } from '../../entities/courier.entity';
import { Order } from '../../entities/order.entity';
import { seed } from '../../seeds/courier.seed';
import { seed as orderSeed } from '../../seeds/order.seed';
import { CourierService } from './courier.service';
import { CreateCandidate, GetCourierOrdersDto } from './dto/courier.dto';

describe('CourierService', () => {
  let service: CourierService;

  const courierRepo = {
    save() {
      return seed[0];
    },
    findOne(id: number) {
      return seed[id - 1];
    },
    update: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const orderRepo = {
    save() {
      return orderSeed[0];
    },
    find() {
      return orderSeed;
    },
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourierService,
        {
          provide: getRepositoryToken(Courier),
          useValue: courierRepo,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepo,
        },
      ],
    }).compile();

    service = module.get<CourierService>(CourierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const data: CreateCandidate = {
      email: 'customer_1@gmail.com',
      password: 'password',
      firstName: 'customer_1',
      lastName: 'customer_1',
      phoneNumber: '+1211111111',
    };

    it('with new email', async () => {
      service['emailExist'] = jest.fn();
      const result = await service.create(data);

      expect(result).toEqual(seed[0].id);
    });

    it('with exist email', async () => {
      service['emailExist'] = jest
        .fn()
        .mockRejectedValue(new BadRequestException());

      await expect(service.create(data)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('find', () => {
    it('with pagination', async () => {
      const params = { limit: 1, offset: 1 };
      const expectData = { data: seed[0], count: seed.length };
      courierRepo.findAndCount.mockReturnValueOnce(Object.values(expectData));

      const result = await service.find(params);
      expect(result).toEqual({ data: seed[0], count: seed.length });
      expect(courierRepo.findAndCount).toHaveBeenCalledWith({
        take: params.limit,
        skip: params.offset,
      });
    });

    it('with default pagination', async () => {
      const expectData = { data: seed[0], count: seed.length };
      courierRepo.findAndCount.mockReturnValueOnce(Object.values(expectData));

      const result = await service.find();
      expect(result).toEqual({ data: seed[0], count: seed.length });
      expect(courierRepo.findAndCount).toHaveBeenCalledWith({
        take: PAGE_LIMIT,
        skip: PAGE_OFFSET,
      });
    });
  });

  describe('update', () => {
    it('should succeed', async () => {
      courierRepo.update.mockReturnValueOnce({ affected: 1 });

      const id = 1;
      const result = await service.update(id, {
        status: 'rejected',
        description: 'testdesc',
      });

      expect(result).toEqual(seed[id - 1]);
    });
  });

  describe('delete', () => {
    it('should succeed', async () => {
      courierRepo.update.mockReturnValueOnce({ affected: 1 });

      const result = await service.delete(1);
      expect(result).toEqual(true);
    });

    it('should fail on not found', async () => {
      courierRepo.update.mockReturnValueOnce({ affected: 0 });

      await expect(service.delete(1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('emailExist', () => {
    it('should exist', async () => {
      courierRepo.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(1),
      });
      await expect(service['emailExist']('test@t.st')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should not exist', async (done) => {
      courierRepo.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(0),
      });
      await service['emailExist']('test@t.st');
      done();
    });
  });

  describe('acceptOrder', () => {
    it('should succeed', async () => {
      const data = orderSeed[3];
      orderRepo.findOne.mockReturnValueOnce(data);
      const result = await service.acceptOrder(1, data.id);

      expect(result).toEqual(data);
    });

    it('fail as order is not scheduled', async () => {
      const data = orderSeed[0];
      orderRepo.findOne.mockReturnValueOnce(data);
      await expect(service.acceptOrder(1, data.id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('acceptOrder', () => {
    it('should succeed', async () => {
      const params: GetCourierOrdersDto = {
        fields: ['id'],
        contains: ['courier'],
      };
      const courierID = 1;
      const expectData = { data: seed[0], count: seed.length };
      orderRepo.findAndCount.mockReturnValueOnce(Object.values(expectData));

      const result = await service.getOrders(courierID, params);

      expect(orderRepo.findAndCount).toHaveBeenCalledWith({
        take: PAGE_LIMIT,
        skip: PAGE_OFFSET,
        relations: params.contains,
        select: params.fields,
        where: { courier: { id: courierID } },
      });

      expect(result).toEqual({ data: seed[0], count: seed.length });
    });
  });
});
