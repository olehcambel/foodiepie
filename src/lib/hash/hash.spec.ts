import { geneHash, compareHash } from './hash';

describe('hash lib', () => {
  it('geneHash', () => {
    const result = geneHash('pass', 10);

    expect(result).toHaveProperty('salt', expect.any(String));
    expect(result).toHaveProperty('hash', expect.any(String));
  });

  it('compareHash', () => {
    const data = geneHash('pass', 10);

    const map = {
      pass: true,
      wrong: false,
    };

    for (const [v, want] of Object.entries(map)) {
      const result = compareHash(v, data.hash, data.salt);
      expect(result).toEqual(want);
    }
  });
});
