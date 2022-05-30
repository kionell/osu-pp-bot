import { Argument, Flag } from 'cli-processor';

export class MissFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'misses';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 1`,
    `${this.globalName} 10`,
  ];

  /**
   * The flag name.
   */
  name = MissFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'X';

  /**
   * The flag title.
   */
  title = 'Misses flag';

  /**
   * The flag description.
   */
  description = 'The number of misses of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'misses',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
    defaultValue: 0,
  });
}
