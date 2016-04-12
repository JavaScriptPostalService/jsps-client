/**
 * csModClientid module.
 * @module core/csModClientid
 * @return {string} - Returns a new random, unique clientid
 */

// This function simply generates a random time based client token.
// Clients will use this token to authenticate themselves, so this should be
// saved in the application if you plan to resubscribe to channels after reloading
// the catsnake client
export const csModClientid = () => {
  let d = new Date().getTime();
  const uuid = 'client-xxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r &0x3 | 0x8 )).toString(16);
  });
  return uuid;
};
