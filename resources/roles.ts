import { RoleSchema } from "../models/role.model";

const BOT: RoleSchema = {
  name: 'ToriBot',
  activePermissions: ['ADMINISTRATOR'],
  inactivePermissions: {}
};

const MODERATOR: RoleSchema = {
  name: 'Moderator',
  activePermissions: [
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'PRIORITY_SPEAKER',
    'MANAGE_MESSAGES',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'MANAGE_NICKNAMES'
  ],
  inactivePermissions: {}
};

const MUTED: RoleSchema = {
  name: 'Muted',
  activePermissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
  inactivePermissions: {
    SEND_MESSAGES: false,
    ADD_REACTIONS: false
  }
};

export { BOT, MODERATOR, MUTED };
