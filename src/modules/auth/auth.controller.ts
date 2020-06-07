import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenRes } from './dto/auth-res.dto';
import { LoginDto } from './dto/auth.dto';
import { Public } from 'src/decorators/access.decorator';

@Controller('auth')
@Public()
@ApiTags('App')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  getToken(@Body() params: LoginDto): Promise<TokenRes> {
    return this.authService.getToken(params);
  }

  getHello(): string {
    return 'Hello World!';
  }

  // @Get('refresh-token')
  // getRefreshToken(params: RefreshTokenDto): TokenRes {
  //   return this.authService.getRefreshToken();
  // }
}
