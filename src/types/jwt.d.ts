/// <reference types="express"/>

declare namespace JWTReq {
  // type UserType = 'customer'
  interface TokenPayload {
    type: 'customer';
    id: number;
  }

  interface Customer extends Request {
    user: TokenPayload;
  }

  interface Token {
    accessToken: string;
    // expiredAt: number;
    // refreshToken: string;
  }

  interface RefreshToken {
    data: TokenPayload;
    // expiredAt: number;
    // refreshToken: string;
  }
}
