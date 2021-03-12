// Dependencies
import { GuildMember, PartialGuildMember, User } from 'discord.js';
import { difference } from 'lodash';

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
    nickname: null,
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
  if (!user.nickname) user.nickname = member.nickname;
  if (!user.roles.length) user.roles = member.roles.cache.map((role) => role.id);
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

/**
 * @description Records an anniversary date for a user.
 * @param member
 * @param date
 */
const addUserAnniversary = async (member: GuildMember, date: Date) => {
  try {
    const user = await getUser(member);
    user.anniversary = date;

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    return `The anniversary of ${member.displayName} has been recorded.\n${getDate(date, 'MMMM Do YYYY')}`;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Checks for changes in the user to be added to the document.
 * @param oldMember
 * @param newMember
 */
const checkMemberChanges = async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
  try {
    const user = await getUser(newMember);
    const newRole = difference(oldMember.roles.cache.array(), newMember.roles.cache.array());

    if (newRole.length) user.roles?.push(newRole[0].id);

    // TODO Check if nickname does not include illegal strings.
    // If it does, newMember.setNickname(CENSORED_NICKNAME);
    if (newMember.nickname !== oldMember.nickname) user.nickname = newMember.nickname;
  } catch (error) {
    throw error;
  }
};

export { addUserAnniversary, buildBannedUser, checkMember, checkMemberChanges, getUser, getUserByUsername };
