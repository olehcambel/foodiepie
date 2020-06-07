import { createConnection } from 'typeorm';
import { Runner } from './runner';

const up = async (): Promise<void> => {
  const connection = await createConnection();
  const path = `${__dirname}/../../seeds`;
  const log = console;
  const runner = new Runner(path, log);

  try {
    await runner.runAll();
  } catch (err) {
    log.error(err);
  }

  await connection.close();
};

if (!module.parent) {
  up();
}
