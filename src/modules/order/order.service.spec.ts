import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrderService } from './order.service';
import { seed as productSeed } from '../../seeds/product.seed';
import { seed as orderSeed } from '../../seeds/order.seed';
import { OrderCheckoutDto, GetCustomerOrders } from './dto/order.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  const orderRepo = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
  };

  const productRepo = {
    findByIds: jest.fn(),
  };

  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productRepo,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    const customerID = 1;
    const params: OrderCheckoutDto = {
      products: [{ id: 1, quantity: 10 }],
      orderAddress: { longitude: 0, latitude: 0, address: 'address' },
      storeLocation: { id: 1 },
    };

    it('should succeed', async () => {
      orderRepo.save.mockImplementationOnce((data) => data);
      productRepo.findByIds.mockReturnValueOnce(productSeed.slice(0, 3));
      const result = await service.checkout(customerID, params);

      expect(result).toHaveProperty('scheduledDate', expect.any(Date));
      expect(result).toHaveProperty('customer', { id: customerID });
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('orderAddress', params.orderAddress);
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('storeLocation', params.storeLocation);
      expect(result).toHaveProperty('totalPrice', expect.any(String));

      expect(result).toHaveProperty('orderItems');
      expect(Array.isArray(result.orderItems)).toEqual(true);
      expect(result.orderItems).toHaveLength(params.products.length);
      expect(result.orderItems[0]).toHaveProperty(
        'quantity',
        params.products[0].quantity,
      );
    });

    it('should fail on invalid product', async () => {
      productRepo.findByIds.mockReturnValueOnce(productSeed.slice(1, 2));

      await expect(service.checkout(customerID, params)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('cancel', () => {
    it('should succeed', async () => {
      const expectData = orderSeed[3];
      orderRepo.findOneOrFail.mockReturnValueOnce(expectData);
      const result = await service.cancel(1, 1);

      expect(orderRepo.save).toBeCalledWith({
        ...expectData,
        status: 'cancelled',
        finishedAt: expect.any(Date),
      });
      expect(result).toEqual(true);
    });

    it('should fail on non-scheduled status', async () => {
      const expectData = orderSeed[0];
      orderRepo.findOneOrFail.mockReturnValueOnce(expectData);
      await expect(service.cancel(1, 1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('find', () => {
    const userID = 1;
    it('should succeed', async () => {
      orderRepo.find.mockReturnValueOnce(orderSeed);
      const params: GetCustomerOrders = { limit: 10, offset: 100 };
      const result = await service.find(userID, params);

      expect(result).toEqual(orderSeed);
      // expect(orderRepo.find).toHaveBeenCalledWith({})
    });

    it('with optional', async () => {
      orderRepo.find.mockReturnValueOnce(orderSeed);
      const result = await service.find(userID);

      expect(result).toEqual(orderSeed);
    });
  });
});
