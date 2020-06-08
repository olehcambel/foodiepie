import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenRes } from './dto/auth-res.dto';
import { LoginDto, CreateCustomerDto } from './dto/auth.dto';
import { Public } from '../../decorators/access.decorator';

@Controller('auth')
@Public()
@ApiTags('App')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  getToken(@Body() params: LoginDto): Promise<TokenRes> {
    return this.service.getToken(params);
  }

  @Post('signup')
  createCustomer(@Body() params: CreateCustomerDto): Promise<TokenRes> {
    return this.service.createCustomer(params);
  }

  getHello(): string {
    return 'Hello World!';
  }

  // @Get('refresh-token')
  // getRefreshToken(params: RefreshTokenDto): TokenRes {
  //   return this.service.getRefreshToken();
  // }
}
