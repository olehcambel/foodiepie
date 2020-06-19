import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Courier } from '../src/entities/courier.entity';
import { AllExceptionFilter } from '../src/filters/all-exception.filter';
import { RolesGuard } from '../src/guards/roles.guard';
import { ResponseInterceptor } from '../src/interceptors/response.interceptor';
import {
  GetCourierDto,
  GetCourierOrdersDto,
  UpdateCourierDto,
} from '../src/modules/courier/dto/courier.dto';
import LanguageSeed from '../src/seeds/language.seed';
import ManagerSeed from '../src/seeds/manager.seed';
import OrderSeed from '../src/seeds/order.seed';

const fake = {
  orderID: 0,
  languageID: 1,
  courier: {
    id: 0,
    token: '',
    signup: {
      email: 'courier@gmail.com',
      phoneNumber: '+33145453245',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
      language: {
        id: 1,
      },
    },
    login: {
      userType: 'courier',
      email: 'courier@gmail.com',
      password: 'password',
    },
  },

  manager: {
    token: '',
  },
};

describe('CourierController (e2e)', () => {
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

  beforeAll(async () => {
    await conn.dropDatabase();
    await conn.synchronize();

    await new LanguageSeed().up();
    await new ManagerSeed().up();

    // create fresh orders
    await new OrderSeed().up();
    fake.orderID = 4; // scheduled
  });

  afterAll(async () => {
    if (conn) {
      await conn.dropDatabase();
      await conn.close();
    }
  });

  it('/couriers/candidates (POST)', () => {
    return request(app.getHttpServer())
      .post('/couriers/candidates')
      .send(fake.courier.signup)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toEqual(expect.any(Number));

        fake.courier.id = body.data;
      });
  });

  it('change courier status to active', async () => {
    const courierRepo = conn.getRepository(Courier);
    const courier = await courierRepo.findOneOrFail(fake.courier.id);

    expect(courier).toBeDefined();
    // use enum
    expect(courier).toHaveProperty(
      'status',
      'pending' as AppEntity.CourierStatus,
    );
    courier.status = 'active';
    await courierRepo.save(courier);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(fake.courier.login)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('accessToken');

        fake.courier.token = body.data.accessToken;
      });
  });

  it('/couriers/me (GET)', () => {
    return request(app.getHttpServer())
      .get('/couriers/me')
      .set('Authorization', `Token ${fake.courier.token}`)
      .query({ fields: ['id', 'status', 'firstName'] } as GetCourierDto)
      .query('contains[]=language') // should be at least 2 elements to use slice
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('status');
        expect(body.data).toHaveProperty('firstName');
      });
  });

  it('/couriers/me (PUT)', () => {
    return request(app.getHttpServer())
      .put('/couriers/me')
      .send({ description: 'new' } as UpdateCourierDto)
      .set('Authorization', `Token ${fake.courier.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('description', 'new');
      });
  });

  it('/couriers/orders (GET)', () => {
    return request(app.getHttpServer())
      .get('/couriers/orders')
      .set('Authorization', `Token ${fake.courier.token}`)
      .query({
        fields: ['id', 'status', 'totalPrice'],
        isSearch: true,
      } as GetCourierOrdersDto)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('count');
        expect(Array.isArray(body.data.data)).toEqual(true);
        expect(body.data.count).toBeGreaterThan(0);

        const order = body.data.data[0];

        expect(order).toHaveProperty('id');
        // use enum
        expect(order).toHaveProperty('status', 'scheduled');
        expect(order).toHaveProperty('totalPrice');
      });
  });

  it('/couriers/orders/orderID/accept (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/couriers/orders/${fake.orderID}/accept`)
      .set('Authorization', `Token ${fake.courier.token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('status', 'active');
        expect(body.data).toHaveProperty('courier', { id: fake.courier.id });
        expect(body.data).toHaveProperty('finishedAt', null);
      });
  });

  it('/couriers/orders (GET)', () => {
    return request(app.getHttpServer())
      .get('/couriers/orders')
      .set('Authorization', `Token ${fake.courier.token}`)
      .query({
        fields: ['id', 'status', 'totalPrice'],
        contains: ['customer', 'courier'],
        filters: { status: 'active' },
      } as GetCourierOrdersDto)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data).toHaveProperty('count');
        expect(Array.isArray(body.data.data)).toEqual(true);
        expect(body.data.count).toBeGreaterThan(0);

        const order = body.data.data[0];
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('status', 'active');
        expect(order).toHaveProperty('courier');
        expect(order).toHaveProperty('customer');
      });
  });

  // add stats
});
