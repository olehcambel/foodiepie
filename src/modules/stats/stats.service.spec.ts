import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { StatsModule } from './stats.module';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  // let customerRepo: Repository<Customer>;
  let conn: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), StatsModule],
      providers: [
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    // customerRepo = module.get<Repository<Customer>>(
    // getRepositoryToken(Customer),
    // );
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
