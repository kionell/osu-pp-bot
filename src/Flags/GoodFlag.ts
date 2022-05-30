import { Argument, Flag } from 'cli-processor';

export class GoodFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'goods';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 35`,
    `${this.globalName} 99`,
  ];

  /**
   * The flag name.
   */
  name = GoodFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'G';

  /**
   * The flag title.
   */
  title = 'Goods flag';

  /**
   * The flag description.
   */
  description = 'The number of 100\'s of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: '100\'s',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
