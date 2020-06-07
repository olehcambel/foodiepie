const _getEnv = <T>(
  key: string,
  cb: (value: string) => T,
  defaultValue?: T,
): T => {
  const value = process.env[key];

  if (value || value === '') {
    const parsed = cb(value);

    if (typeof parsed === 'number' && Number.isNaN(parsed)) {
      throw new Error(`Invalid number for value: "${key}"`);
    }

    return parsed;
  }
  if (defaultValue === undefined) {
    throw new Error(`Missing default value "${key}"`);
  }

  // at least if (IS_PROD)
  // logger.warn(`Missing env variable: "${key}". Default value was applied: ${defaultValue}`);
  return defaultValue;
};

export function getEnv(key: string, defaultValue?: string): string {
  return _getEnv(key, (value) => value, defaultValue);
}

export function getEnvNumber(key: string, defaultValue?: number): number {
  return _getEnv(key, (value) => Number(value), defaultValue);
}

export function getEnvArray(key: string, defaultValue?: string[]): string[] {
  return _getEnv(
    key,
    (value) => value.replace(/ /g, '').split(','),
    defaultValue,
  );
}

export function getEnvBool(key: string, defaultValue?: boolean): boolean {
  return _getEnv(key, (value) => ['true', '1'].includes(value), defaultValue);
}
