import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { Connection } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let conn: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    conn = module.get<Connection>(Connection);
  });

  afterEach(async () => {
    if (conn) {
      await conn.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
