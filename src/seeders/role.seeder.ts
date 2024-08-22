import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../roles/schemas/role.schema';
import { rolesSeedData } from '../roles/seed-data/role.seed-data';
import { INestApplicationContext, Logger } from '@nestjs/common';

export async function runRoleSeeder(app: INestApplicationContext) {
  try {
    const roleModel = app.get<Model<Role>>(getModelToken(Role.name));
    for (const role of rolesSeedData) {
      const existingRole = await roleModel.findOne({ name: role.name });
      if (!existingRole) {
        await roleModel.create(role);
        console.log(`Role ${role.name} created`);
      } else {
        console.log(`Role ${role.name} already exists`);
      }
    }
  } catch (error) {
    Logger.error('Error in runRoleSeeder', error);
  }
}
