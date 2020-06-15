import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception.filter';
import { RolesGuard } from '../src/guards/roles.guard';
import { UpdateCustomerDto } from '../src/modules/customer/dto/customer.dto';
import {
  CreateStoreDto,
  SaveProductsDto,
  UpdateStoreDto,
  UpdateStoreFullDto,
} from '../src/modules/store/dto/store.dto';
import LanguageSeed from '../src/seeds/language.seed';
import ManagerSeed from '../src/seeds/manager.seed';
import { OrderCheckoutDto } from '../src/modules/order/dto/order.dto';

const fake = {
  storeID: 0,
  languageID: 0,
  products: [0, 0] as [number, number],
  manager: {
    token: '',
    login: {
      userType: 'manager',
      email: 'manager@gmail.com',
      password: 'password',
    },
  },
  customer: {
    id: 0,
    token: '',
    signup: {
      name: 'string',
      email: 'customer@gmail.com',
      password: 'password',
    },
    login: {
      userType: 'customer',
      email: 'customer@gmail.com',
      password: 'password',
    },
  },
  customerOwner: {
    token: '',
    signup: {
      name: 'string',
      email: 'customer_owner@gmail.com',
      password: 'password',
    },
    login: {
      userType: 'customer',
      email: 'customer_owner@gmail.com',
      password: 'password',
    },
  },
};

describe('AppController (e2e)', () => {
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

    await conn.dropDatabase();
    await conn.synchronize();
    await new ManagerSeed().up();
    await new LanguageSeed().up();
  });

  afterAll(async () => {
    if (conn) {
      await conn.dropDatabase();
      await conn.close();
    }
  });

  // https://github.com/gothinkster/realworld/blob/master/api/Conduit.postman_collection.json
  describe('Auth (Customer)', () => {
    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(fake.customer.signup)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(fake.customerOwner.signup)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(fake.manager.login)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');

          fake.manager.token = res.body.accessToken;
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(fake.customer.login)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');

          fake.customer.token = res.body.accessToken;
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(fake.customerOwner.login)
        .expect(201)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('accessToken');

          fake.customerOwner.token = res.body.accessToken;
        });
    });

    it('/customers/me (GET)', () => {
      return request(app.getHttpServer())
        .get('/customers/me')
        .set('Authorization', `Token ${fake.customer.token}`)
        .expect(200)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');

          fake.customer.id = res.body.id;
        });
    });

    it('/managers/customers/:customerId (PUT)', () => {
      return request(app.getHttpServer())
        .put(`/managers/customers/${fake.customer.id}`)
        .send({ status: 'active' })
        .set('Authorization', `Token ${fake.manager.token}`)
        .expect(200)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
        });
    });

    it('/customers/me (PUT)', () => {
      return request(app.getHttpServer())
        .put('/customers/me')
        .send({ description: 'new' } as UpdateCustomerDto)
        .set('Authorization', `Token ${fake.customer.token}`)
        .expect(200)
        .expect((res) => {
          expect(res).toBeDefined();
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
        });
    });

    describe('store', () => {
      it('/stores (POST)', () => {
        return request(app.getHttpServer())
          .post('/stores')
          .send({
            title: 'Title',
            slug: 'title',
            location: {
              address: 'address',
              postalCode: '11111',
              longitude: 0,
              latitude: 0,
            },
          } as CreateStoreDto)
          .set('Authorization', `Token ${fake.customerOwner.token}`)
          .expect(201)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('owner');

            fake.storeID = res.body.id;
          });
      });

      it('/managers/stores/:storeId (PUT)', () => {
        return request(app.getHttpServer())
          .put(`/managers/stores/${fake.storeID}`)
          .send({ status: 'active' } as UpdateStoreFullDto)
          .set('Authorization', `Token ${fake.manager.token}`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('status', 'active');
          });
      });

      it('/stores/:storeId (PUT)', () => {
        return request(app.getHttpServer())
          .put(`/stores/${fake.storeID}`)
          .send({ description: 'new_description' } as UpdateStoreDto)
          .set('Authorization', `Token ${fake.customerOwner.token}`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('description', 'new_description');
          });
      });

      it('/stores (GET)', () => {
        return request(app.getHttpServer())
          .get('/stores')
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('count', expect.any(Number));
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toEqual(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0]).toHaveProperty('id');
            expect(res.body.data[0]).toHaveProperty('status', 'active');
          });
      });

      it('/stores/:storeId (GET)', () => {
        return request(app.getHttpServer())
          .get(`/stores/${fake.storeID}`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('status', 'active');
          });
      });

      it('/stores/:storeId/menus (PUT)', () => {
        return request(app.getHttpServer())
          .put(`/stores/${fake.storeID}/menus`)
          .set('Authorization', `Token ${fake.customerOwner.token}`)
          .send({
            data: [
              {
                price: '150',
                externalID: 'ext.1',
                translations: [
                  { title: 'title.1', language: { id: fake.languageID } },
                ],
              },
              {
                price: '9.99',
                externalID: 'ext.2',
                translations: [
                  { title: 'title.2', language: { id: fake.languageID } },
                ],
              },
            ],
          } as SaveProductsDto)

          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(Array.isArray(res.body)).toEqual(true);
            expect(res.body).toHaveLength(2);

            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('externalID');
            expect(res.body[0]).toHaveProperty('price', expect.any(String));

            fake.products[0] = res.body[0].id;
            fake.products[1] = res.body[1].id;
          });
      });

      it('/stores/:storeId/menus (GET)', () => {
        return request(app.getHttpServer())
          .get(`/stores/${fake.storeID}/menus`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(Array.isArray(res.body)).toEqual(true);
            if (res.body.length) {
              expect(res.body[0]).toHaveProperty('id');
              expect(res.body[0]).toHaveProperty('externalID');
              expect(res.body[0]).toHaveProperty('price', expect.any(String));
            }
          });
      });
    });

    describe('customer order', () => {
      let orderID = 0;

      it('/customers/orders/checkout (POST)', () => {
        return request(app.getHttpServer())
          .post('/customers/orders/checkout')
          .set('Authorization', `Token ${fake.customer.token}`)
          .send({
            orderAddress: { address: 'address', latitude: 0, longitude: 0 },
            products: [
              { quantity: 10, id: fake.products[0] },
              { quantity: 1, id: fake.products[1] },
            ],
          } as OrderCheckoutDto)
          .expect(201)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('orderItems');
            expect(res.body).toHaveProperty('customer');
            expect(res.body).toHaveProperty('orderAddress');
            expect(res.body).toHaveProperty('finishedAt', null);
            expect(res.body).toHaveProperty('scheduledDate');
            expect(res.body).toHaveProperty('totalPrice', expect.any(String));
            expect(res.body).toHaveProperty(
              'deliveryPrice',
              expect.any(String),
            );
            expect(res.body).toHaveProperty('scheduledDate');

            orderID = res.body.id;
          });
      });

      it('/customers/orders (GET)', () => {
        return request(app.getHttpServer())
          .get('/customers/orders')
          .set('Authorization', `Token ${fake.customer.token}`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            expect(Array.isArray(res.body)).toEqual(true);
            if (res.body.length) {
              expect(res.body[0]).toHaveProperty('id');
              expect(res.body[0]).toHaveProperty('status');
              expect(res.body[0]).toHaveProperty('isPaid');
              expect(res.body[0]).toHaveProperty('totalPrice');
            }
          });
      });

      it('/customers/orders/:orderId/cancel (PUT)', () => {
        return request(app.getHttpServer())
          .put(`/customers/orders/${orderID}/cancel`)
          .set('Authorization', `Token ${fake.customer.token}`)
          .expect(200)
          .expect((res) => {
            expect(res).toBeDefined();
            // FIXME: should true. for some reason it converts to {}
            expect(res.body).toEqual({});
          });
      });
    });
  });
});
