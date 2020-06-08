import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { TokenRes } from './dto/auth-res.dto';
import { LoginDto, CreateCustomerDto } from './dto/auth.dto';
import { Customer } from '../../entities/customer.entity';
import { getToken } from '../../common/jwt/jwt';

@Injectable()
export class AuthService {
  constructor(private customerService: CustomerService) {}

  async getToken(params: LoginDto): Promise<TokenRes> {
    const user = await this.customerService.findByCreds(params);

    return this.createToken(user);
  }

  async createCustomer(params: CreateCustomerDto): Promise<TokenRes> {
    const user = await this.customerService.create(params);

    return this.createToken(user);
  }

  // getRefreshToken(): Promise<TokenRes> {
  //
  // }

  // TODO: should be both for customer and courier
  private createToken(params: Customer): JWTReq.Token {
    const data: JWTReq.TokenPayload = {
      id: params.id,
      type: 'customer',
    };

    // TODO: add session

    return getToken({
      data,
      // refreshToken: 1,
      // expiredAt: 1,
    });
  }
}
