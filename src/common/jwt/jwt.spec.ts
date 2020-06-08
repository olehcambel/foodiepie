// TODO: mv to jest prestart config
require('../../config');
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

  it('jwtVerify', () => {
    const token = getToken({ data: testData });
    const result = jwtVerify('Token ' + token.accessToken);

    expect(result).toHaveProperty('exp', expect.any(Number));
    expect(result).toHaveProperty('iat', expect.any(Number));
    expect(result.data).toEqual(testData);
  });
});
