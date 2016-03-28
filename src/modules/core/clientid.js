/**
 * modClientid module.
 * @module core/modClientid
 * @return {string} - Returns a new random, unique clientid
 */
export const modClientid = () => {
  let d = new Date().getTime();
  let uuid = 'client-xxxxxxxx'.replace(/[xy]/g, c => {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r&0x3 | 0x8)).toString(16);
  });
  return uuid;
};
