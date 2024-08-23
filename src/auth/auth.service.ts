import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';
import { ERRORS, JWT_SECRET } from '../shared/constants/constants';
import { NotFoundError, PasswordMismatchError } from '../shared/errors';
import { Utils } from '../shared/utils/utils';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './auth.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

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

  async login({ email, password }: LoginUserDto): Promise<UserWithToken> {
    try {
      // check if user exists with provided credentials
      const user = await this.checkUserForLogin(email, password);
      return this.getUserLoggedIn(user);
    } catch (error) {
      Logger.error(
        `Error in login of AuthService where login credentials are ${JSON.stringify(
          {
            email,
            password,
          },
        )}`,
      );
      throw error;
    }
  }

  async checkUserForLogin(email: string, password: string): Promise<User> {
    try {
      // get user by email along with password
      const user = await this.userService.findUserByEmail(email, true);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      // verify password
      const isPasswordVerified = Utils.verifyPassword(user.password, password);
      if (!isPasswordVerified) {
        throw new PasswordMismatchError(ERRORS.PASSWORD_MISMATCHED);
      }
      // return user without password
      delete user.password;
      return user;
    } catch (error) {
      Logger.error(
        `Error in checkUserForLogin of auth service where credentials are ${JSON.stringify(
          {
            email,
            password,
          },
        )}`,
      );
      throw error;
    }
  }

  getUserLoggedIn(user: User): UserWithToken {
    try {
      // get user loggedIn
      const token = this.generateToken(
        { _id: user._id as string },
        parseInt(this.configService.get<string>('ACCESS_TOKEN_EXPIRY_TIME')),
      );
      // add user permissions to user object
      return { user, accessToken: token };
    } catch (error) {
      Logger.error(
        `Error in getUserLoggedIn of AuthService where user: ${JSON.stringify(user)}`,
      );
      throw error;
    }
  }

  generateToken(payload: TokenPayload, expiresIn: number): string {
    const secretKey = this.configService.get<string>(JWT_SECRET);
    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
