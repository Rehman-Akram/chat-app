import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async createUser(createUserDto: CreateUserDto, role: string): Promise<User> {
    try {
      return await this.userService.createUser(createUserDto, role);
    } catch (error) {
      Logger.error(
        `Error in createUser of authService where createUserDto: ${JSON.stringify(createUserDto)}`,
      );
      throw error;
    }
  }
}
