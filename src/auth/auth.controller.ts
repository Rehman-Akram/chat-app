import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_ROLES } from '../shared/constants/constants';
import { User } from '../users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('create-user')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.createUser(createUserDto, DEFAULT_ROLES.USER);
  }
}
