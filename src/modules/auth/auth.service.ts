import { Injectable } from '@nestjs/common';
import { getToken } from 'src/common/jwt/jwt';
import { Customer } from 'src/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { TokenRes } from './dto/auth-res.dto';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private customerService: CustomerService) {}

  async getToken(params: LoginDto): Promise<TokenRes> {
    const user = await this.customerService.findByCreds(params);

    return this.createToken(user);
  }

  // getRefreshToken(): Promise<TokenRes> {
  //
  // }

  // TODO: should both for customer and courier
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
