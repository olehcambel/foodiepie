declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends JWTReq.TokenPayload {}

  interface Request {
    user: User;
    realIp: string;
  }
}
