import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreAddress } from '../../entities/store-address.entity';
import { StoreType } from '../../entities/store-type.entity';
import { Store } from '../../entities/store.entity';
import { CreateStoreAddressDto, CreateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,

    @InjectRepository(StoreAddress)
    private readonly storeAddressRepo: Repository<StoreAddress>,

    @InjectRepository(StoreType)
    private readonly storeTypeRepo: Repository<StoreType>,
  ) {}

  getTypes(): Promise<StoreType[]> {
    return this.storeTypeRepo.find();
  }

  getStore(storeID: number): Promise<Store> {
    return this.storeRepo.findOne(storeID);
  }

  getStoreAddress(addressID: number): Promise<StoreAddress> {
    return this.storeAddressRepo.findOne(addressID);
  }

  createStoreAddress(params: CreateStoreAddressDto): Promise<StoreAddress> {
    return this.storeAddressRepo.save(params);
  }

  createStore(params: CreateStoreDto): Promise<Store> {
    return this.storeRepo.save(params);
  }
}
