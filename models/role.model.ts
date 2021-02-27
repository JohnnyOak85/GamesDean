import { PermissionString } from 'discord.js';

interface PermissionList {
  [name: string]: boolean;
}

interface RoleSchema {
  activePermissions: PermissionString[];
  inactivePermissions: PermissionList;
  name: string;
}

export { PermissionList, RoleSchema };
