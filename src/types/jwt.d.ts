/// <reference types="express"/>

declare namespace JWTReq {
  interface TokenPayload {
    type: AppEntity.UserType;
    id: number;
  }

  interface User extends Request {
    user: TokenPayload;
  }
  // interface Customer extends Request {
  //   user: TokenPayload;
  // }

  // interface Courier extends Request {
  //   user: TokenPayload
  // }

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
