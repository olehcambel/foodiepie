import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception.filter';
import { RolesGuard } from '../src/guards/roles.guard';

const fakeData = {
  name: 'name_1',
  description: 'description_1',
  email: 'customer_1@gmail.com',
  password: 'password',
};

const fixtures = {
  signup1: {
    email: fakeData.email,
    password: fakeData.password,
    name: fakeData.name,
  },
  login1: {
    email: fakeData.email,
    password: fakeData.password,
  },
  upd1: {
    name: fakeData.name,
    description: fakeData.description,
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
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new RolesGuard(reflector));
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

  // https://github.com/gothinkster/realworld/blob/master/api/Conduit.postman_collection.json
  describe('Auth (Customer)', () => {
    let accessToken: string;

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

    it('/auth/login (POST) remember token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(fixtures.login1)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');

          accessToken = res.body.accessToken;
        });
    });

    it('/customers/me (GET)', () => {
      return request(app.getHttpServer())
        .get('/customers/me')
        .set('Authorization', `Token ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', fixtures.signup1.email);
          expect(res.body).toHaveProperty('description', fakeData.description);
          expect(res.body).toHaveProperty('name', fixtures.signup1.name);
          expect(res.body).toHaveProperty('status', 'active');
          expect(res.body).toHaveProperty('language', null);
        });
    });

    it('/customers/me (PUT)', () => {
      return request(app.getHttpServer())
        .put('/customers/me')
        .set('Authorization', `Token ${accessToken}`)
        .send(fixtures.upd1)
        .expect(200)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', fakeData.email);
          expect(res.body).toHaveProperty('description', fakeData.description);
          expect(res.body).toHaveProperty('name', fakeData.name);
          expect(res.body).toHaveProperty('status', 'active');
          expect(res.body).toHaveProperty('language', null);
        });
    });
  });
});
