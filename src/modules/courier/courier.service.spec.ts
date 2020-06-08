import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Courier } from '../../entities/courier.entity';
import { CourierModule } from './courier.module';
import { CourierService } from './courier.service';

describe('CourierService', () => {
  let service: CourierService;
  // let courierRepo: Repository<Courier>;
  let conn: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), CourierModule],
      providers: [
        {
          provide: getRepositoryToken(Courier),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CourierService>(CourierService);
    // courierRepo = module.get<Repository<Courier>>(getRepositoryToken(Courier));
    conn = module.get<Connection>(Connection);
  });

  afterAll(async () => {
    if (conn) {
      await conn.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
