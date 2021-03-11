// Discord
import { GuildMember, User } from 'discord.js';

// Helpers
import { getDoc, readDirectory, saveDoc } from './storage.helper';
import { getDate } from './utils.helper';

/**
 * @description Creates a user object from a banned user.
 * @param user
 * @param reason
 */
const buildBannedUser = (user: User, reason: string): UserDoc => {
  return {
    _id: user.id,
    roles: [],
    strikes: [reason],
    username: user.username
  };
};

/**
 * @description Guarantees the user document has all needed proprieties.
 * @param user
 * @param member
 */
const ensureDoc = (user: UserDoc, member: GuildMember): UserDoc => {
  if (!user._id) user._id = member.id;
  if (!user.anniversary) user.anniversary = undefined;
  if (!user.nickname) user.nickname = member.nickname;
  if (!user.roles) user.roles = member.roles.cache.map((role) => role.id);
  if (!user.strikes) user.strikes = [];
  if (!user.timer) user.timer = undefined;
  if (!user.username) user.username = member.user.username;

  return user;
};

/**
 * @description Returns a user document from the database.
 * @param member
 */
const getUser = async (member: GuildMember): Promise<UserDoc> => {
  try {
    const userDoc = await getDoc(`${member.guild.id}/${member.user.id}`);

    return ensureDoc(userDoc, member);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Finds a user by the username.
 * @param guildId
 * @param username
 */
const getUserByUsername = async (guildId: string, username: string): Promise<UserDoc | undefined> => {
  try {
    const userList = await readDirectory(guildId);

    for await (const user of userList) {
      const userDoc = await getDoc(`users/${user}`);

      if ((userDoc.username = username)) return userDoc;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * @description Checks if the member can be moderated.
 * @param moderator
 * @param member
 */
const checkMember = (moderator: GuildMember, member: GuildMember): string | void => {
  if (!member) return 'You need to mention a valid user.';
  if (moderator.user.id === member.user.id) return 'You cannot moderate yourself!';
  if (!member.manageable) return `You cannot moderate ${member.user.username}.`;
};

const addUserAnniversary = async (member: GuildMember, date: Date) => {
  try {
    const user = await getUser(member);
    user.anniversary = date;

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    return `The anniversary of ${member.displayName} has been recorded.\n${getDate(date)}`;
  } catch (error) {
    throw error;
  }
};

export { addUserAnniversary, buildBannedUser, checkMember, getUser, getUserByUsername };
