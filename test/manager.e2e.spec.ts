import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception.filter';
import { RolesGuard } from '../src/guards/roles.guard';
import { ResponseInterceptor } from '../src/interceptors/response.interceptor';

describe('ManagerController (e2e)', () => {
  let app: INestApplication;
  let conn: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    conn = moduleFixture.get<Connection>(Connection);
    app = moduleFixture.createNestApplication();

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new RolesGuard(reflector));
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        whitelist: true,
        validationError: { target: false },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (conn) {
      await conn.dropDatabase();
      await conn.close();
    }
  });

  it('todo', () => {
    expect(1).toEqual(1);
  });
});
