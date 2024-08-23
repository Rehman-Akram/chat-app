import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async findRoleByName(role: string): Promise<Role> {
    try {
      return await this.roleModel.findOne({ name: role, isDeleted: false });
    } catch (error) {
      Logger.error(
        `Error in findRoleByName of RolesService where role name: ${role}`,
      );
      throw error;
    }
  }
}
