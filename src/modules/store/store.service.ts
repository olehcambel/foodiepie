import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAGE_LIMIT, PAGE_OFFSET } from '../../common/constants';
import { Product } from '../../entities/product.entity';
import { Store } from '../../entities/store.entity';
import { StoresResDto } from './dto/store-res.dto';
import {
  CreateStoreDto,
  GetStoresDto,
  SaveProductsDto,
  UpdateStoreDto,
} from './dto/store.dto';

// TODO: MV to object lib
// K extends keyof ??
function mapFromArray<T>(array: T[], prop: string): Record<any, T> {
  const map: Record<any, T> = {};
  for (let i = 0; i < array.length; i++) {
    map[array[i][prop]] = array[i];
  }
  return map;
}

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  createStore(userID: number, params: CreateStoreDto): Promise<Store> {
    return this.storeRepo.save({
      owner: { id: userID },
      ...params,
    });
  }

  async getStores(params: GetStoresDto): Promise<StoresResDto> {
    const [data, count] = await this.storeRepo.findAndCount({
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
      relations: params.contains,
      select: params.fields,
      where: { status: 'active' },
    });

    return { data, count };
  }

  getStore(storeID: number): Promise<Store> {
    return this.storeRepo.findOne(storeID);
  }

  private isAffected(affected: number): void {
    if (!affected) {
      throw new ForbiddenException('No access to entity');
    }
  }

  async updateStore(
    userID: number,
    storeID: number,
    params: UpdateStoreDto,
  ): Promise<Store> {
    const res = await this.storeRepo.update(
      { id: storeID, owner: { id: userID } },
      params,
    );
    this.isAffected(res.affected);
    return this.getStore(storeID);
  }

  async deleteStore(userID: number, storeID: number): Promise<boolean> {
    const res = await this.storeRepo.update(
      { id: storeID, owner: { id: userID } },
      { status: 'deleted' },
    );
    this.isAffected(res.affected);
    return true;
  }

  getMenus(storeID: number): Promise<Product[]> {
    return this.productRepo.find({
      where: { store: { id: storeID }, status: 'active' },
    });
  }

  async saveMenus(
    userID: number,
    storeID: number,
    params: SaveProductsDto,
  ): Promise<Product[]> {
    const store = await this.storeRepo.findOne({
      select: ['id'],
      where: { id: storeID, owner: { id: userID } },
    });
    if (!store) {
      // this.isAffected(0)
      throw new ForbiddenException();
    }

    const curMenu = await this.productRepo.find({ where: { store: storeID } });
    // const changed: Product[] = []
    const deleted: Product[] = [];
    const newMenu: Product[] = [];

    const mapOld = mapFromArray(curMenu, 'externalID');
    const mapNew = mapFromArray(params.data, 'externalID');
    for (const id in mapOld) {
      if (!mapNew[id]) {
        deleted.push(mapOld[id]);
      } else if (mapNew[id].externalID === mapOld[id].externalID) {
        const newP = this.productRepo.create(mapNew[id]);
        newP.store = this.storeRepo.create({ id: storeID });

        newP.id = mapOld[id].id;
        newMenu.push(newP);
      }
    }

    for (const id in mapNew) {
      if (!mapOld[id]) {
        const newP = this.productRepo.create(mapNew[id]);
        newP.store = this.storeRepo.create({ id: storeID });

        newMenu.push(newP);
      }
    }
    if (deleted.length) {
      await this.productRepo.remove(deleted);
    }
    // FIXME: when updating the same row - product translation removes productID
    await this.productRepo.save(newMenu);

    return newMenu;
  }
}
