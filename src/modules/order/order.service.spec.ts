import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrderService } from './order.service';
import { seed as productSeed } from '../../seeds/product.seed';
import { OrderCheckoutDto } from './dto/order.dto';

describe('OrderService', () => {
  const orderRepo = {
    save<T>(data: T): T {
      return data;
    },
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
    it('should succeed', async () => {
      productRepo.findByIds.mockReturnValueOnce(productSeed.slice(0, 3));
      const customerID = 1;
      const params: OrderCheckoutDto = {
        products: [{ id: 1, quantity: 10 }],
        orderAddress: { longitude: 0, latitude: 0, address: 'address' },
        storeLocation: { id: 1 },
        scheduledDate: new Date(),
      };
      const result = await service.checkout(customerID, params);

      expect(result).toEqual({
        customer: {
          id: customerID,
        },
        description: undefined,
        orderAddress: params.orderAddress,
        orderItems: [
          {
            price: '10',
            product: {
              id: 1,
            },
            quantity: 10,
          },
        ],
        scheduledDate: params.scheduledDate,
        status: 'scheduled',
        storeLocation: params.storeLocation,
        totalPrice: '10',
      });
    });
  });
});
