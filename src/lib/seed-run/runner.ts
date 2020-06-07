import { exists, readdir } from 'fs';
import { promisify } from 'util';

const existsP = promisify(exists);
const readdirP = promisify(readdir);

interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface Seed {
  up(): Promise<boolean>;
}

export class Runner {
  constructor(private path: string, private readonly log: Logger) {}

  async runAll(): Promise<void> {
    if (!(await existsP(this.path)))
      throw new Error(`Invalid path "${this.path}"`);

    const files = await readdirP(this.path);
    files.sort();

    for (const fileName of files) {
      if (/(.*)\.js$/.test(fileName)) {
        await this.runOne(fileName);
      }
    }
  }

  async runOne(filename: string): Promise<void> {
    const path = `${this.path}/${filename}`;
    this.log.info(`${filename} starting`);
    const { default: SeedScript } = await import(path);
    const isSeeded = await new SeedScript().up();

    if (!isSeeded) this.log.warn(`${filename} already exists`);
    else this.log.info(`${filename} finished`);
  }
}
