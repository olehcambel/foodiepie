import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception.filter';

const fixtures = {
  signup1: {
    email: 'customer_1@gmail.com',
    password: 'password',
    name: 'customer_1',
  },
  login1: {
    email: 'customer_1@gmail.com',
    password: 'password',
  },
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let conn: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    conn = moduleFixture.get<Connection>(Connection);
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionFilter());
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

  afterEach(async () => {
    if (conn) {
      await conn.close();
    }
  });

  describe('Auth', () => {
    // let accessToken: string
    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(fixtures.signup1)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');

          // accessToken = res.body
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(fixtures.login1)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    // it('/ (GET)', () => {
    //   return request(app.getHttpServer())
    //     .get('/')
    //     .expect(200)
    //     .expect('Hello World!');
    // });
  });
});
