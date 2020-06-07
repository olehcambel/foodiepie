import { Length, IsEmail, IsUUID } from 'class-validator';
export class LoginDto {
  @IsEmail()
  readonly email: string;

  @Length(8, 18)
  readonly password: string;
}

export class RefreshTokenDto {
  @IsUUID()
  refreshToken: string;
}
