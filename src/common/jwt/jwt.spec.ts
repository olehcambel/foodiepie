// TODO: mv to jest prestart config
// require('../../config');
import { UnauthorizedException } from '@nestjs/common';
import { getToken, jwtVerify } from './jwt';

describe('JWT common', () => {
  const testData: JWTReq.TokenPayload = {
    id: 1,
    type: 'customer',
  };
  it('getToken', () => {
    const result = getToken({ data: testData });

    const expected: JWTReq.Token = { accessToken: expect.any(String) };
    expect(result).toEqual(expected);
  });

  describe('jwtVerify', () => {
    it('should succeed', () => {
      const token = getToken({ data: testData });
      const result = jwtVerify('Token ' + token.accessToken);

      expect(result).toHaveProperty('exp', expect.any(Number));
      expect(result).toHaveProperty('iat', expect.any(Number));
      expect(result.data).toEqual(testData);
    });

    it('should fail on invalid', () => {
      const delegate = (): void => {
        jwtVerify('Token ' + 'XXXMALFORMED');
      };
      expect(delegate).toThrow(UnauthorizedException);
    });

    it('should fail on expired', () => {
      const delegate = (): void => {
        jwtVerify(
          'Token ' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ0eXBlIjoiY3VzdG9tZXIifSwiaWF0IjoxNTkyMzEyNzgyLCJleHAiOjE1ODcxMjg3ODJ9._bInple4K8-k7qwWJ4JgKaRpm8o6vXcXwRR2HnikMt8',
        );
      };
      expect(delegate).toThrow(UnauthorizedException);
    });
  });
});
