import { config } from 'dotenv';
import { getEnv, getEnvNumber, getEnvBool } from './lib/dotenv-get';

const IS_TEST = getEnvBool('NODE_ENV', false);

config({ path: IS_TEST ? './.env.test' : './.env' });

// MAIN CONF
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const PORT = getEnvNumber('PORT', 3002);
export const IS_ADD_SWAGGER = getEnvBool('ADD_SWAGGER', false);

// LOGGER

// JWT
export const JWT_CONFIG = {
  secret: getEnv('JWT_CONFIG_SECRET'),
  expire: getEnv('JWT_CONFIG_SECRET_EXPIRE', '30m'),
};
