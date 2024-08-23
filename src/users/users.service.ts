import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserStatus } from './enums/status.enum';
import { ERRORS } from '../shared/constants/constants';
import { ConflictError, NotFoundError } from '../shared/errors';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private roleService: RolesService,
  ) {}

  /**
   * This function is used to find user by means of _id which is not active
   *
   * @param _id
   * @returns user | null
   */
  async findOneById(_id: string): Promise<User | null> {
    try {
      const user = (
        await this.userModel
          .findOne({
            _id,
            status: UserStatus.ACTIVE,
          })
          .populate({
            path: 'roles',
            select: '-users',
          })
          .exec()
      ).toObject();

      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error(`Error in findOneById of user service where _id: ${_id}`);
      throw error;
    }
  }

  /**
   * This function is used to find and return user by email address.
   *
   * @param email
   * @param isPasswordRequired if this is true it will also returns user password
   * @returns User
   */
  async findUserByEmail(
    email: string,
    isPasswordRequired?: boolean,
  ): Promise<User> {
    try {
      const query = this.userModel
        .findOne({ email, status: UserStatus.ACTIVE })
        .populate({
          path: 'roles',
          select: '-users',
        });
      if (isPasswordRequired) {
        query.select('+password');
      }
      const user = await query.exec();
      if (user) {
        return user.toObject();
      }
      return user;
    } catch (error) {
      Logger.error(
        `Error in findUserByEmail of user service where credentials: ${JSON.stringify(
          {
            email,
            isPasswordRequired,
          },
        )}`,
      );
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto, role: string): Promise<User> {
    try {
      // check if user already exist or not
      const userFetched = await this.findUserByEmail(createUserDto.email);
      if (userFetched) {
        throw new ConflictError(ERRORS.USER_ALREADY_EXISTS);
      }
      // fetch role
      const roleFetched = await this.roleService.findRoleByName(role);
      if (!roleFetched) {
        throw new NotFoundError(ERRORS.ROLE_NOT_FOUND);
      }
      const user = await this.userModel.create({
        ...createUserDto,
        roles: [roleFetched._id],
      });
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      Logger.error(
        `Error in createUser of user service where createUserDto: ${JSON.stringify(createUserDto)}`,
      );
      throw error;
    }
  }
}
