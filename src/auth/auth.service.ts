import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';
import { ERRORS, JWT_SECRET } from '../shared/constants/constants';
import {
  BadRequestError,
  NotFoundError,
  PasswordMismatchError,
} from '../shared/errors';
import { Utils } from '../shared/utils/utils';
import { ConfigService } from '@nestjs/config';
import { InviteUser, TokenPayload } from './auth.interface';
import * as jwt from 'jsonwebtoken';
import { UserStatus } from 'src/users/enums/status.enum';
import { EmailService } from 'src/shared/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async publicSignUp(
    createUserDto: CreateUserDto,
    role: string,
  ): Promise<User> {
    try {
      return await this.userService.createUser(
        createUserDto,
        role,
        UserStatus.ACTIVE,
      );
      //TODO send email
    } catch (error) {
      Logger.error(
        `Error in publicSignUp of authService where createUserDto: ${JSON.stringify(createUserDto)}`,
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

  async acceptInvite(newUser: User, invitedBy: string): Promise<User> {
    try {
      // check user (pending or already active)
      const invitedByUser = await this.userService.findUserByEmail(invitedBy);
      if (newUser.status === UserStatus.ACTIVE) {
        throw new BadRequestError(ERRORS.USER_ALREADY_EXISTS);
      }

      const updatedUser = await this.userService.updateUserById(
        newUser._id as string,
        { status: UserStatus.ACTIVE, emailVerified: true },
      );

      await this.userService.createContact({
        email: newUser.email,
        currentUser: invitedByUser,
      });
      return updatedUser;
    } catch (error) {
      Logger.error(
        `Error in acceptInvite of user service where params are: ${JSON.stringify({ newUser, invitedBy })}`,
      );
      throw error;
    }
  }

  async inviteUser(
    inviteUserDto: InviteUser,
    role: string,
    currentUser: User,
  ): Promise<User> {
    try {
      const password = Utils.generatePassword(12);
      inviteUserDto.password = password;
      const user = await this.userService.createUser(inviteUserDto, role);
      // create invite link
      const inviteToken = this.generateToken(
        { _id: user._id as string },
        parseInt(this.configService.get<string>('ACCESS_TOKEN_EXPIRY_TIME')),
      );
      const inviteLink = this.generateInviteLink(
        inviteToken,
        currentUser.email,
      );
      this.emailService.sendEmail(
        user.email,
        'Invite Email to Chat App',
        `Hi ${user.firstName} ${user.lastName ? user.lastName : ''}!<br/> Please find invite link to verify your email account and lets get started.<br/><br/>Invite Link: ${inviteLink}<br/><br/>Regards<br/><br/>${currentUser.firstName} ${currentUser.lastName ? currentUser.lastName : ''}`,
      );
      return user;
    } catch (error) {
      Logger.error(
        `Error in inviteUser of User service where params: ${JSON.stringify({ inviteUserDto, role, currentUser })}`,
      );
      throw error;
    }
  }

  generateInviteLink(token: string, email: string): string {
    return `${this.configService.get<string>('BASE_URL')}/auth/accept-invite?token=${token}&invitedBy=${email}`;
  }
}
