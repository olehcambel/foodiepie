import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
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
  UpdateStoreFullDto,
} from './dto/store.dto';
import { ProductTranslation } from '../../entities/product-translation.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  create(userID: number, params: CreateStoreDto): Promise<Store> {
    // TODO: should be pending as default!
    return this.storeRepo.save({
      owner: { id: userID },
      ...params,
    });
  }

  async find(params: GetStoresDto): Promise<StoresResDto> {
    const [data, count] = await this.storeRepo.findAndCount({
      select: params.fields,
      relations: params.contains,
      where: { status: 'active' },
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
    });

    return { data, count };
  }

  findOne(storeID: number): Promise<Store> {
    return this.storeRepo.findOne(storeID);
  }

  private isAffected(affected: number): void {
    if (!affected) {
      throw new ForbiddenException('No access to entity');
    }
  }

  async update(
    userID: number,
    storeID: number,
    params: UpdateStoreDto,
  ): Promise<Store> {
    const res = await this.storeRepo.update(
      { id: storeID, owner: { id: userID } },
      params,
    );
    this.isAffected(res.affected);
    return this.findOne(storeID);
  }

  // TODO: better to merge with update() and make userID optional
  async updateFull(
    storeID: number,
    params: UpdateStoreFullDto,
  ): Promise<Store> {
    const res = await this.storeRepo.update({ id: storeID }, params);
    this.isAffected(res.affected);
    return this.findOne(storeID);
  }

  async delete(userID: number, storeID: number): Promise<boolean> {
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

  /**
   * FIXME: is not working as expected
   * instead of deleting each time productTranslations - should update if
   * storeID and languageID is remain the same as in DB.
   * FIXME: check if language id is valid. reference error occured
   */
  async saveMenus(
    userID: number,
    storeID: number,
    params: SaveProductsDto,
  ): Promise<Product[]> {
    const store = await this.storeRepo.findOne(storeID, {
      select: ['id'],
      where: { owner: { id: userID } },
    });
    if (!store) {
      throw new ForbiddenException();
    }

    const curMenu = await this.productRepo
      .createQueryBuilder('p')
      .select(['p.id', 'p.externalID'])
      .addSelect('pT.id')
      .leftJoin('p.translations', 'pT')
      .where('p.store = :storeID', { storeID })
      .getMany();
    const newMenu: Product[] = [];
    const oldPT: ProductTranslation[] = [];

    const delta = getDelta(
      curMenu,
      this.productRepo.create(params.data),
      'externalID',
      (o, n) => {
        if (n.externalID === o.externalID) {
          n.id = o.id;
          oldPT.push(...o.translations);

          // means that data is not equal and should be updated
          return false;
        }
        return true;
      },
    );

    for (const p of delta.added.concat(delta.changed)) {
      p.store = this.storeRepo.create({ id: storeID });
      newMenu.push(p);
    }

    await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.remove(oldPT);
      await transactionalEntityManager.remove(delta.deleted);
      await transactionalEntityManager.save(newMenu);
    });
    // if (delta.deleted.length) { }

    return newMenu;
  }
}
