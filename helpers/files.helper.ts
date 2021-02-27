import { ensureDirSync, pathExistsSync, readdirSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { logInfo } from './logs.helper';

const databaseDir = `C:/database`; // TODO Get a proper path.
ensureDirSync('C:/database/users'); // TODO Maybe don't do this?

/**
 * @description Returns the list of files inside a directory.
 * @param path
 */
const readDirectory = async (path: string): Promise<string[]> => {
  try {
    return readdirSync(`${__dirname}/${path}`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Ensures a file exists and returns it.
 * @param path
 */
const getDoc = async (path: string): Promise<User> => {
  try {
    if (!pathExistsSync(`${databaseDir}/${path}.json`)) saveDoc(path, {});

    return readJsonSync(`${databaseDir}/${path}.json`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Saves a file and logs the event.
 * @param path
 * @param file
 */
const saveDoc = async (path: string, file: User): Promise<void> => {
  try {
    writeJsonSync(`${databaseDir}/${path}.json`, file);

    logInfo('Updated file.');
  } catch (error) {
    throw error;
  }
};

export { getDoc, readDirectory, saveDoc };
