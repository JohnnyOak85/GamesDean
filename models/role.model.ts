import { PermissionResolvable } from 'discord.js';

interface RoleList {
  [name: string]: RoleSchema;
}

interface PermissionList {
  [name: string]: boolean;
}

interface RoleSchema {
  activePermissions: PermissionResolvable;
  inactivePermissions: PermissionList;
  name: string;
}

export { PermissionList, RoleList, RoleSchema };
