import { Argument, Flag } from 'cli-processor';

export class ModsFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'mods';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} HDHR`,
    `${this.globalName} EZHDDTFL`,
    `${this.globalName} MR4K`,
    `${this.globalName} EZHT`,
  ];

  /**
   * The flag name.
   */
  name = ModsFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'm';

  /**
   * The flag title.
   */
  title = 'Mods flag';

  /**
   * The flag description.
   */
  description = 'A string with mod combination or bitwise. Default value is NM';

  /**
   * The flag argument.
   */
  arg = new Argument<string>({
    description: 'combination or bitwise',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    defaultValue: 'NM',
  });
}
