class Command {
  static showBadge = 'SHOW_BADGE';

  static altR = 'Alt+R';

  /**
   * 
   * @returns {Promise<chrome.commands.Command[]>}
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      chrome.commands.getAll((result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError.message);
        }
        return resolve(result);
      });
    });
  }

  /**
   * @returns {Promise<String>}
   */
  static async getCommandString() {
    let cmdString = '';
    const cmds = await Command.getAll();
    const reloadCmd = cmds.find((cmd) => cmd.name === Command.altR);
    if (reloadCmd) {
      const chars = reloadCmd.shortcut?.split('');
      if (chars) {
        cmdString = chars.map((char) => `<kbd>${char}</kbd>`).join('+');
      }
    }
    return cmdString;
  }
}

export default Command;
