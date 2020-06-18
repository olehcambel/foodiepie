import { config } from 'dotenv';

// const IS_TEST = process.env.NODE_ENV === 'test';

// if (IS_TEST) process.env.TS = 'true';
// const dir = process.env.TS ? 'src' : 'dist';
config({ path: '../.env.test' });
