import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from '../../config';

const verify = <T>(token: string, secret: string): TokenDecoded<T> => {
  try {
    const split = token.split('Token ');
    token = split[1];

    const decoded = jwt.verify(token, secret) as TokenDecoded<T>;
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expired');
    }

    throw new UnauthorizedException(err.message);
  }
};

export const jwtVerify = (token: string): TokenDecoded<JWTReq.TokenPayload> => {
  return verify(token, JWT_CONFIG.secret);
};

const getAccessToken = (data: JWTReq.TokenPayload): string => {
  return jwt.sign({ data }, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expire,
  });
};

export const getToken = (res: JWTReq.RefreshToken): JWTReq.Token => {
  return {
    accessToken: getAccessToken(res.data),
    // expiredAt: res.expiredAt,
    // refreshToken: res.refreshToken,
  };
};

interface TokenDecoded<T> {
  exp: number;
  iat: number;
  sub: string;
  data: T;
}
