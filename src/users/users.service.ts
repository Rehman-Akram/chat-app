import { Injectable, Logger } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserStatus } from './enums/status.enum';
import { ERRORS } from '../shared/constants/constants';
import { ConflictError, NotFoundError } from '../shared/errors';
import { RolesService } from '../roles/roles.service';
import { CreateUser } from './users.interface';

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
    status?: UserStatus,
  ): Promise<User> {
    try {
      const findOptions: { email: string; status?: UserStatus } = {
        email: email.toLowerCase(),
      };
      if (status) {
        findOptions.status = status;
      }
      const query = this.userModel.findOne(findOptions).populate({
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

  // TODO: Make separate function to create user

  // TODO: Make function to send email (simple template upon creation of user )

  async createUser(
    createUserDto: CreateUser,
    role: string,
    status?: UserStatus,
  ): Promise<User> {
    try {
      // check if user already exist or not
      const userFetched = await this.findUserByEmail(createUserDto.email);
      if (!userFetched) {
        // fetch role
        const roleFetched = await this.roleService.findRoleByName(role);
        if (!roleFetched) {
          throw new NotFoundError(ERRORS.ROLE_NOT_FOUND);
        }
        if (status) {
          createUserDto.status = status;
        }
        const user = await this.userModel.create({
          ...createUserDto,
          roles: [roleFetched._id],
        });
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
      } else if (userFetched && userFetched.status === UserStatus.ACTIVE) {
        throw new ConflictError(ERRORS.USER_ALREADY_EXISTS);
      } else {
        return userFetched;
      }
    } catch (error) {
      Logger.error(
        `Error in createUser of user service where createUserDto: ${JSON.stringify({ createUserDto })}`,
      );
      throw error;
    }
  }

  async updateUserById(id: string, data: Partial<User>): Promise<User> {
    try {
      await this.userModel.updateOne({ _id: id }, data);
      return (await this.userModel.findById(id)).toObject();
    } catch (error) {
      Logger.error(
        `Error in updateUser of user service where params are : ${JSON.stringify({ id, data })} `,
      );
      throw error;
    }
  }

  /**
   * Here user with email will be added as contact in current user contacts
   *
   * @param obj, email & current User
   * @returns User
   */
  async createContact({
    email,
    currentUser,
  }: {
    email: string;
    currentUser: User;
  }): Promise<User> {
    try {
      // find contact by email
      const userToBeAdded = await this.findUserByEmail(email);
      // if not found throw error
      if (!userToBeAdded) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      // if found add to contacts
      return await this.updateUserById(currentUser._id as string, {
        contacts: [...currentUser.contacts, userToBeAdded._id as ObjectId],
      });
    } catch (error) {
      Logger.error(
        `Error in createContact of user service where createContactDto: ${JSON.stringify(email)}`,
      );
      throw error;
    }
  }
}
