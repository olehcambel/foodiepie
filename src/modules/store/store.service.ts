import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAGE_LIMIT, PAGE_OFFSET } from '../../common/constants';
import { Product } from '../../entities/product.entity';
import { Store } from '../../entities/store.entity';
import { getDelta } from '../../lib/object';
import { StoresResDto } from './dto/store-res.dto';
import {
  CreateStoreDto,
  GetStoresDto,
  SaveProductsDto,
  UpdateStoreDto,
} from './dto/store.dto';

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
      select: params.fields,
      relations: params.contains,
      where: { status: 'active' },
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
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
    // TODO: check if language id is valid. reference error
    const store = await this.storeRepo.findOne({
      select: ['id'],
      where: { id: storeID, owner: { id: userID } },
    });
    if (!store) {
      // this.isAffected(0)
      throw new ForbiddenException();
    }

    const curMenu = await this.productRepo.find({ where: { store: storeID } });
    const newMenu: Product[] = [];

    const delta = getDelta(
      curMenu,
      this.productRepo.create(params.data),
      'externalID',
      // (a, b) => a.externalID === b.externalID,
      (o, n) => {
        if (n.externalID === o.externalID) {
          n.id = o.id;
          return true;
        }
        return false;
      },
    );

    for (const p of delta.added.concat(delta.changed)) {
      p.store = this.storeRepo.create({ id: storeID });
      newMenu.push(p);
    }

    // if (delta.deleted.length) { }
    await this.productRepo.remove(delta.deleted);
    await this.productRepo.save(newMenu);

    return newMenu;
  }
}
