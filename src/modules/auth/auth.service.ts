import { BadRequestException, Injectable } from '@nestjs/common';
import { getToken } from '../../common/jwt/jwt';
import { compareHash } from '../../lib/hash';
import { CustomerService } from '../customer/customer.service';
import { TokenRes } from './dto/auth-res.dto';
import { CreateCustomerDto, LoginDto } from './dto/auth.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
  ) {}

  private async validateUser(params: LoginDto): Promise<AppEntity.User> {
    const user = await this.userService.findByEmail(params);
    if (
      !user ||
      !compareHash(params.password, user.passwordHash, user.passwordSalt)
    ) {
      throw new BadRequestException('Invalid username or password');
    }

    return user;
  }

  async getToken(params: LoginDto): Promise<TokenRes> {
    const user = await this.validateUser(params);

    return this.createToken(user, params.userType);
  }

  async createCustomer(params: CreateCustomerDto): Promise<TokenRes> {
    const user = await this.customerService.create(params);

    return this.createToken(user, 'customer');
  }

  // getRefreshToken(): Promise<TokenRes> { }

  private createToken(
    params: AppEntity.User,
    type: AppEntity.UserType,
  ): JWTReq.Token {
    const data: JWTReq.TokenPayload = {
      id: params.id,
      type,
    };

    // TODO: add session

    return getToken({
      data,
      // refreshToken: 1,
      // expiredAt: 1,
    });
  }
}
