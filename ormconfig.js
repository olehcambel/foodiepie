// @ts-check

'use strict';

const IS_TEST = process.env.NODE_ENV === 'test';
if (IS_TEST) process.env.TS = 'true';
const dir = process.env.TS ? 'src' : 'dist';

const {
  MYSQL_PORT,
  MYSQL_HOST,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_LOG,
} = process.env;

/** @type {import('@nestjs/typeorm').TypeOrmModuleOptions} */
const options = {
  port: (MYSQL_PORT && Number(MYSQL_PORT)) || 3306,
  host: MYSQL_HOST,
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: IS_TEST ? MYSQL_DATABASE + '_test' : MYSQL_DATABASE,
  type: 'mysql',
  bigNumberStrings: true,

  // synchronize: IS_TEST,
  // dropSchema: IS_TEST,

  migrations: [`${dir}/migrations/*.{ts,js}`],
  entities: [`${dir}/entities/*.entity.{ts,js}`],
  subscribers: [`${dir}/subscribers/*.{ts,js}`],
  logging: IS_TEST ? false : ['true', '1'].includes(MYSQL_LOG),
  cli: {
    entitiesDir: './src/entities',
    migrationsDir: './src/migrations',
    subscribersDir: './src/subscribers',
  },
};

module.exports = options;
