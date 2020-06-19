// @ts-check

'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require('dotenv');

const IS_TEST = process.env.NODE_ENV === 'test';

if (IS_TEST) process.env.TS = 'true';
const dir = process.env.TS ? 'src' : 'dist';
// FIXME: temp solution. if test -> use
config({ path: IS_TEST ? `./${dir}/../.env.test` : `./${dir}/../.env` });

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  TYPEORM_LOGGING,
} = process.env;

/** @type {import('@nestjs/typeorm').TypeOrmModuleOptions} */
const options = {
  port: 5432,
  // port: (TYPEORM_PORT && Number(TYPEORM_PORT)) || 5432,
  // host: TYPEORM_HOST,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  // database: IS_TEST ? POSTGRES_DB + '_test' : POSTGRES_DB,
  type: 'postgres',

  // synchronize: IS_TEST,
  // dropSchema: IS_TEST,

  migrations: [`${dir}/migrations/*.{ts,js}`],
  entities: [`${dir}/entities/*.entity.{ts,js}`],
  subscribers: [`${dir}/subscribers/*.{ts,js}`],
  logging: IS_TEST ? false : ['true', '1'].includes(TYPEORM_LOGGING),
  cli: {
    entitiesDir: './src/entities',
    migrationsDir: './src/migrations',
    subscribersDir: './src/subscribers',
  },
};

module.exports = options;
