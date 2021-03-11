// Discord
import { Guild, GuildChannel, GuildChannelManager, NewsChannel, PermissionOverwriteOption, Role, TextChannel } from 'discord.js';

// Helpers
import { logInfo } from './utils.helper';

// Configurations
import { PERMISSIONS, RULES } from '../config.json';

/**
 * @description Sends a message with the rules list to the system channel.
 * @param channel
 */
const setRules = async (channel: TextChannel | NewsChannel | null | undefined, rules: string[]): Promise<void> => {
  try {
    if (!channel?.isText()) return;

    let reply = '```markdown\n';

    for (const rule of rules) {
      reply += `* ${rule}\n`;
    }

    reply += '```';

    const messages = await channel.messages.fetch();

    for await (const message of messages.array()) {
      if (message.content !== reply) message.delete();
    }

    if (!messages.array().length) channel.send(`${reply}`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Creates a new channel in the information category.
 * @param guild
 * @param channelSchema
 * @param category
 * @param system
 */
const buildInfoChannel = async (
  guild: Guild,
  channelSchema: ChannelSchema,
  category: GuildChannel,
  system?: boolean
): Promise<void> => {
  try {
    const channel = await getChannel(guild.channels, channelSchema, guild.systemChannel);

    if (!channel) return;

    channel.setParent(category.id);
    channel.overwritePermissions(category.permissionOverwrites);

    if (system) guild.setSystemChannel(channel);
    else if (channel.isText()) setRules(channel, RULES);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Creates the information category.
 * @param guild
 */
const buildInfoCategory = async (guild: Guild): Promise<void> => {
  try {
    const category = await getChannel(guild.channels, { name: 'information', type: 'category' }, guild.systemChannel);

    if (!category) return;

    category.setPosition(0);
    category.updateOverwrite(guild.roles.everyone, PERMISSIONS);
    buildInfoChannel(guild, { name: 'rules', type: 'text' }, category);
    buildInfoChannel(guild, { name: 'events', type: 'text' }, category, true);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Creates a new channel on the guild.
 * @param channelManager
 * @param channelSchema
 */
const createChannel = async (
  channelManager: GuildChannelManager | undefined,
  channelSchema: ChannelSchema,
  systemChannel: TextChannel | null | undefined
): Promise<GuildChannel | undefined> => {
  try {
    if (!channelManager) return;

    const channel = await channelManager.create(channelSchema.name, {
      type: channelSchema.type
    });

    systemChannel?.send(`Created new channel <#${channel?.id}>!`);
    logInfo(`Created channel ${channelSchema.name} on ${channelManager?.guild.name}.`);

    return channel;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Retrieves a new channel from the guild.
 * @param channelManager
 * @param channelSchema
 */
const getChannel = async (
  channelManager: GuildChannelManager | undefined,
  channelSchema: ChannelSchema,
  systemChannel: TextChannel | null | undefined
): Promise<GuildChannel | void> => {
  try {
    if (!channelManager) return;

    const channel = channelManager.cache.find((guildChannel) => guildChannel.name === channelSchema.name);

    if (!channel) return await createChannel(channelManager, channelSchema, systemChannel);

    return channel;
  } catch (error) {
    throw error;
  }
};

const updatePermissions = async (channelManager: GuildChannelManager, role: Role, permissions: PermissionOverwriteOption) => {
  for (const channel of channelManager?.cache.array()) {
    channel.updateOverwrite(role, permissions);
  }
};

export { buildInfoCategory, getChannel, setRules, updatePermissions };
