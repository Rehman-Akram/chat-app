import { DEFAULT_ROLES, PERMISSIONS } from '../../shared/constants/constants';

export const rolesSeedData = [
  {
    name: DEFAULT_ROLES.SUPER_ADMIN,
    description: 'Super Administrator',
    permissions: {
      [PERMISSIONS.USERS]: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      [PERMISSIONS.ROLES]: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
  },
];
