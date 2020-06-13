import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from '../../entities/courier.entity';
import { Order } from '../../entities/order.entity';
import { seed } from '../../seeds/courier.seed';
import { seed as orderSeed } from '../../seeds/order.seed';
import { CourierService } from './courier.service';
import { CreateCandidate, GetCourierOrdersDto } from './dto/courier.dto';
import { BadRequestException } from '@nestjs/common';
import { PAGE_OFFSET } from '../../common/constants';

describe('CourierService', () => {
  let service: CourierService;
  let courierRepo: Repository<Courier>;
  let orderRepo: Repository<Order>;

  const courierMockRepo = {
    save() {
      return seed[0];
    },
    findOne(id: number) {
      return seed[id - 1];
    },
  };

  const orderMockRepo = {
    save() {
      return orderSeed[0];
    },
    find() {
      return orderSeed;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourierService,
        {
          provide: getRepositoryToken(Courier),
          useValue: courierMockRepo,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: orderMockRepo,
        },
      ],
    }).compile();

    service = module.get<CourierService>(CourierService);
    courierRepo = module.get<Repository<Courier>>(getRepositoryToken(Courier));
    orderRepo = module.get<Repository<Order>>(getRepositoryToken(Order));
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
      courierRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(0),
      });

      const result = await service.create(data);

      expect(result).toEqual(seed[0].id);
    });
  });

  describe('find', () => {
    it('with pagination', async () => {
      const params = { limit: 1, offset: 1 };
      const expectData = { data: seed[0], count: seed.length };
      courierRepo.findAndCount = jest
        .fn()
        .mockReturnValueOnce(Object.values(expectData));

      const result = await service.find(params);
      expect(result).toEqual({ data: seed[0], count: seed.length });
      expect(courierRepo.findAndCount).toHaveBeenCalledWith({
        take: params.limit,
        skip: params.offset,
      });
    });
  });

  describe('update', () => {
    it('should succeed', async () => {
      const id = 1;
      courierRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });
      const result = await service.update(id, {
        status: 'rejected',
        description: 'testdesc',
      });

      expect(result).toEqual(seed[id - 1]);
    });
  });

  describe('delete', () => {
    it('should succeed', async () => {
      courierRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });

      const result = service.delete(1);
      expect(result).toBeTruthy();
    });

    it('should fail on not яfound', async () => {
      courierRepo.update = jest.fn().mockReturnValueOnce({ affected: 0 });

      await expect(service.delete(1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('acceptOrder', () => {
    it('should succeed', async () => {
      const data = orderSeed[3];
      orderRepo.findOne = jest.fn().mockReturnValueOnce(data);
      const result = await service.acceptOrder(1, data.id);

      expect(result).toEqual(data);
    });

    it('fail as order is not scheduled', async () => {
      const data = orderSeed[0];
      orderRepo.findOne = jest.fn().mockReturnValueOnce(data);
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
        limit: 10,
      };
      const courierID = 1;
      const expectData = { data: seed[0], count: seed.length };
      orderRepo.findAndCount = jest
        .fn()
        .mockReturnValueOnce(Object.values(expectData));
      const result = await service.getOrders(courierID, params);

      expect(orderRepo.findAndCount).toHaveBeenCalledWith({
        take: params.limit,
        skip: PAGE_OFFSET,
        relations: params.contains,
        select: params.fields,
        where: { courier: { id: courierID } },
      });

      expect(result).toEqual({ data: seed[0], count: seed.length });
    });
  });
});
