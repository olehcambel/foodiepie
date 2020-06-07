import { createHmac, randomBytes } from 'crypto';

interface Hash {
  hash: string;
  salt: string;
}

const md5 = (value: string, key: string): string => {
  return createHmac('md5', key).update(value).digest('hex');
};

export const geneHash = (password: string, saltLength: number): Hash => {
  // FIXME: temp solution
  const salt = randomBytes(saltLength).toString('base64'); // hex
  const hash = md5(password, salt);

  return { salt, hash };
};

export const compareHash = (
  password: string,
  hash: string,
  salt: string,
): boolean => {
  const userHash = md5(password, salt);

  return userHash === hash;
};
