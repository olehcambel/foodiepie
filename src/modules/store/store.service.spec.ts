import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Store } from '../../entities/store.entity';
import { seed as productSeed } from '../../seeds/product.seed';
import { seed as storeSeed } from '../../seeds/store.seed';
import { SaveProductsDto, CreateStoreDto, GetStoresDto } from './dto/store.dto';
import { StoreService } from './store.service';
import typeorm = require('typeorm');
import { PAGE_OFFSET, PAGE_LIMIT } from '../../common/constants';

describe('StoreService', () => {
  let productRepo: Repository<Product>;
  let storeRepo: Repository<Store>;

  const storeMockRepo = {
    save<T>(data: T): T {
      return data;
    },
    create<T>(data: T): T {
      return data;
    },
  };

  const productMockRepo = {
    save: jest.fn().mockReturnValue(storeSeed[0]),
    remove: jest.fn().mockReturnValue(undefined),
    create<T>(data: T): T {
      return data;
    },
  };

  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: storeMockRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productMockRepo,
        },
      ],
    }).compile();
    service = module.get<StoreService>(StoreService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    storeRepo = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should succeed', async () => {
      const data: CreateStoreDto = {
        location: {
          address: '327 West 42nd Street, New York, NY 10036',
          postalCode: '10036',
          latitude: 0,
          longitude: 0,
        },
        slug: 'mmafia',
        title: 'mmafia',
      };
      const userID = 1;
      const result = await service.create(userID, data);

      expect(result).toHaveProperty('location', data.location);
      expect(result).toHaveProperty('owner', { id: userID });
      expect(result).toHaveProperty('slug', data.slug);
      expect(result).toHaveProperty('title', data.title);
    });
  });

  describe('find', () => {
    it('with pagination', async () => {
      const params: GetStoresDto = {
        fields: ['id', 'slug', 'status'],
        contains: ['location'],
      };
      const expectData = { data: storeSeed[0], count: storeSeed.length };
      storeRepo.findAndCount = jest
        .fn()
        .mockReturnValueOnce(Object.values(expectData));

      const result = await service.find(params);
      expect(result).toEqual(expectData);
      expect(storeRepo.findAndCount).toHaveBeenCalledWith({
        take: PAGE_LIMIT,
        skip: PAGE_OFFSET,
        select: params.fields,
        relations: params.contains,
        where: { status: 'active' },
      });
    });
  });

  describe('findOne', () => {
    it('should succeed', async () => {
      const id = 1;
      storeRepo.findOne = jest.fn().mockReturnValueOnce(storeSeed[id - 1]);
      const result = await service.findOne(id);
      expect(result).toEqual(storeSeed[id - 1]);
    });
  });

  describe('update', () => {
    it('should succeed', async () => {
      // service.findOne = jest.fn().mockReturnValueOnce()
      const storeID = 1;
      service.findOne = jest.fn().mockReturnValueOnce(storeSeed[storeID - 1]);
      storeRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });
      const result = await service.update(1, storeID, { description: 'desc' });
      expect(result).toEqual(storeSeed[storeID - 1]);
    });
  });

  describe('delete', () => {
    it('should succeed', async () => {
      storeRepo.update = jest.fn().mockReturnValueOnce({ affected: 1 });
      const result = await service.delete(1, 1);
      expect(result).toEqual(true);
    });
  });

  describe('getMenus', () => {
    it('should succeed', async () => {
      productRepo.find = jest.fn().mockReturnValueOnce(productSeed);
      const storeID = 1;
      const result = await service.getMenus(storeID);

      expect(result).toEqual(productSeed);
      expect(productRepo.find).toHaveBeenCalledWith({
        where: { store: { id: storeID }, status: 'active' },
      });
    });
  });

  // TODO: should be refactored
  describe('saveMenus', () => {
    //
    it('failed as store not found', async () => {
      storeRepo.findOne = jest.fn().mockReturnValueOnce(undefined);
      await expect(
        service.saveMenus(1, 1, { data: [] }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should save changed', async () => {
      const data: SaveProductsDto['data'] = [
        {
          price: '9999',
          imageURL: 'https://testmenow.ai',
          externalID: productSeed[0].externalID,
          translations: [],
        },
        productRepo.create(productSeed[1]),
      ];
      storeRepo.findOne = jest.fn().mockReturnValueOnce(storeSeed[0]);
      productRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(productSeed.slice(0, 2)),
      });
      const spyRemove = jest.fn();
      typeorm.getManager = jest.fn().mockReturnValueOnce({
        transaction: (cb) =>
          cb({
            remove: spyRemove,
            save: jest.fn(),
          }),
      });

      const result = await service.saveMenus(1, 1, { data });

      expect(result).toEqual(data);
      expect(spyRemove).toHaveBeenCalledWith([]);
    });

    it('should remove all as no data', async () => {
      const data: SaveProductsDto['data'] = [];
      storeRepo.findOne = jest
        .fn()
        .mockReturnValueOnce((id: number) => storeSeed[id - 1]);
      productRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(productSeed),
      });
      const spyRemove = jest.fn();
      typeorm.getManager = jest.fn().mockReturnValueOnce({
        transaction: (cb) =>
          cb({
            remove: spyRemove,
            save: jest.fn(),
          }),
      });
      // productRepo.find = jest.fn().mockReturnValueOnce(productSeed);
      // productRepo.remove = jest.fn();
      const result = await service.saveMenus(1, 1, { data });

      expect(result).toHaveLength(0);
      expect(spyRemove).toHaveBeenCalledWith(productSeed);
    });

    it('should save new', async () => {
      productRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue([]),
      });
      const spyRemove = jest.fn();
      typeorm.getManager = jest.fn().mockReturnValueOnce({
        transaction: (cb) =>
          cb({
            remove: spyRemove,
            save: jest.fn(),
          }),
      });
      // productRepo.find = jest.fn().mockReturnValueOnce([]);
      storeRepo.findOne = jest
        .fn()
        .mockReturnValueOnce((id: number) => storeSeed[id - 1]);
      const data: SaveProductsDto['data'] = [
        {
          price: '10',
          externalID: 'EXT_NEW',
          translations: [],
        },
      ];

      const result = await service.saveMenus(1, 1, { data });

      expect(result).toEqual(data);
      expect(spyRemove).toHaveBeenCalledWith([]);
    });

    it('should remove old and save new', async () => {
      const expectRemove: SaveProductsDto['data'] = [
        productRepo.create(productSeed[0]),
      ];
      storeRepo.findOne = jest
        .fn()
        .mockReturnValueOnce((id: number) => storeSeed[id - 1]);
      productRepo.createQueryBuilder = jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(expectRemove),
      });
      const spyRemove = jest.fn();
      typeorm.getManager = jest.fn().mockReturnValueOnce({
        transaction: (cb) =>
          cb({
            remove: spyRemove,
            save: jest.fn(),
          }),
      });
      // productRepo.find = jest.fn().mockReturnValueOnce(expectRemove);
      const data: SaveProductsDto['data'] = [
        {
          price: '10',
          externalID: 'EXT_NEW',
          translations: [],
        },
      ];

      const result = await service.saveMenus(1, 1, { data });

      expect(result).toEqual(data);
      expect(spyRemove).toHaveBeenCalledWith(expectRemove);
    });
  });

  // const inBody = {
  //   data: [
  //     {
  //       externalID: 'ext_1',
  //       translations: [
  //         {
  //           title: 't(_1',
  //           language: { id: 1 },
  //         },
  //       ],
  //     },
  //     {
  //       externalID: 'ext_2',
  //       translations: [
  //         {
  //           title: 't(_2',
  //           language: { id: 1 },
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const inDB = [
  //   {
  //     id: 11,
  //     externalID: 'ext_1',
  //     translations: [
  //       {
  //         id: 50,
  //         title: 't(_1',
  //         language: { id: 1 },
  //       },
  //       {
  //         id: 51,
  //         title: 't(_1.2',
  //         language: { id: 2 },
  //       },
  //     ],
  //   },
  //   {
  //     id: 12,
  //     externalID: 'ext_2',
  //     translations: [
  //       {
  //         id: 52,
  //         title: 't(_2',
  //         language: { id: 1 },
  //       },
  //     ],
  //   },
  // ];

  // const outBody = {
  //   data: [
  //     {
  //       id: 11,
  //       externalID: 'ext_1',
  //       translations: [
  //         {
  //           id: 50,
  //           title: 't(_1',
  //           language: {
  //             id: 1,
  //           },
  //         },
  //         // DELETE: pt 51
  //       ],
  //     },
  //     {
  //       externalID: 'ext_2',
  //       price: '2.2',
  //       translations: [
  //         {
  //           id: 52,
  //           title: 't(_2',
  //           language: {
  //             id: 1,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };
});
