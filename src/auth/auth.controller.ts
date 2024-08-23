import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_ROLES } from '../shared/constants/constants';
import { User } from '../users/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('create-user')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.createUser(createUserDto, DEFAULT_ROLES.USER);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserWithToken> {
    return await this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @Get('who-am-i')
  async whoAmI(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }
}
