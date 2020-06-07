import { getEnv, getEnvArray, getEnvBool, getEnvNumber } from './dotenv-get';

describe('get-env', () => {
  const notExistKey = 'NOT_EXISTS';
  const getRandKey = (): string => `GET_ENV_${Math.random()}`;
  describe('getEnv', () => {
    it('should exists getEnv', () => {
      expect(getEnv).toBeDefined();
    });
    it('should use default value', () => {
      const result = getEnv(notExistKey, 'OK');
      expect(result).toEqual('OK');
    });
    it('should find key', () => {
      const key = getRandKey();
      process.env[key] = 'OK';
      const result = getEnv(key);
      expect(result).toEqual('OK');
    });
    it('should throw error on not found Env', () => {
      const key = getRandKey();
      expect(() => getEnv(key)).toThrow(Error);
    });
  });
  describe('getEnvBool', () => {
    it('should exists getEnvBool', () => {
      expect(getEnvBool).toBeDefined();
    });
    it('should use default value', () => {
      const result = getEnvBool(notExistKey, true);
      expect(result).toBeTruthy();
    });
    it('should find key', () => {
      const key = getRandKey();
      process.env[key] = 'true';
      const result = getEnvBool(key);
      expect(result).toBeTruthy();
    });
    it('should throw error on not found Env', () => {
      const key = getRandKey();
      expect(() => getEnvBool(key)).toThrow(Error);
    });
  });
  describe('getEnvArray', () => {
    it('should exists getEnvArray', () => {
      expect(getEnvArray).toBeDefined();
    });
    it('should use default value', () => {
      const data = ['string1', 'string2', 'string3'];
      const result = getEnvArray(notExistKey, data);
      expect(result).toEqual(data);
    });
    it('should convert string to array', () => {
      const key = getRandKey();
      process.env[key] = 'string1,string2,string3';
      const result = getEnvArray(key);
      expect(result).toHaveLength(3);
      expect(result).toEqual(['string1', 'string2', 'string3']);
    });
  });
  describe('getEnvNumber', () => {
    it('should exists getEnvNumber', () => {
      expect(getEnvNumber).toBeDefined();
    });
    it('should use default value', () => {
      const result = getEnvNumber(notExistKey, 100);
      expect(result).toEqual(100);
    });
    it('should throw error on invalid number', () => {
      const key = getRandKey();
      process.env[key] = 'inva1id';
      expect(() => getEnvNumber(key)).toThrow(Error);
    });
  });
});
