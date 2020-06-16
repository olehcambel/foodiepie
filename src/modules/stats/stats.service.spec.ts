import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderAddress } from '../../entities/order-address.entity';
import { Order } from '../../entities/order.entity';
import { StatsService } from './stats.service';
import { GetStatCourierResDto } from './dto/stats-res.dto';

describe('StatsService', () => {
  let service: StatsService;

  const orderRepo = {
    createQueryBuilder: jest.fn(),
  };

  const orderAddressRepo = {
    createQueryBuilder: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepo,
        },
        {
          provide: getRepositoryToken(OrderAddress),
          useValue: orderAddressRepo,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCourierPerf', () => {
    it('should succeed', async () => {
      orderRepo.createQueryBuilder.mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockReturnValueOnce({
          averageTime: '00:40',
          orderCount: '10',
          orderPayout: '100',
        } as GetStatCourierResDto),
      });

      const result = await service['getCourierPerf'](1, [
        'orderCount',
        'orderPayout',
        'averageTime',
      ]);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('orderCount', expect.any(String));
      expect(result).toHaveProperty('orderPayout', expect.any(String));
      expect(result).toHaveProperty('averageTime', expect.any(String));
    });
  });

  describe('getCommonAddress', () => {
    it('should succeed', async () => {
      orderAddressRepo.createQueryBuilder.mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockReturnValueOnce({
          commonAddress: 'test',
        } as GetStatCourierResDto),
      });
      const result = await service['getCommonAddress'](1, ['commonAddress']);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('commonAddress', expect.any(String));
    });
  });
});
