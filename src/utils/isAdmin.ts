import SETTINGS from '../settings';

const isAdmin = (userId: string) => {
  if (userId === null) {
    return false;
  }

  if (SETTINGS.DISCORD.ADMIN_IDS.includes(userId)) {
    return true;
  }

  return false;
};

export default isAdmin;
