import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Manager } from '../../entities/manager.entity';
import { ManagerModule } from './manager.module';
import { ManagerService } from './manager.service';

describe('ManagerService', () => {
  let service: ManagerService;
  // let customerRepo: Repository<Manager>;
  let conn: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), ManagerModule],
      providers: [
        {
          provide: getRepositoryToken(Manager),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ManagerService>(ManagerService);
    // customerRepo = module.get<Repository<Manager>>(getRepositoryToken(Manager));
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
