import { Argument, Flag } from 'cli-processor';

export class MehFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'mehs';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 13`,
    `${this.globalName} 29`,
  ];

  /**
   * The flag name.
   */
  name = MehFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'M';

  /**
   * The flag title.
   */
  title = 'Mehs flag';

  /**
   * The flag description.
   */
  description = 'The number of 50\'s of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: '50\'s',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
