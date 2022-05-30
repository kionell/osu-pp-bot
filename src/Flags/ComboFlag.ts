import { Argument, Flag } from 'cli-processor';

export class ComboFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'combo';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 129`,
    `${this.globalName} 534`,
  ];

  /**
   * The flag name.
   */
  name = ComboFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'c';

  /**
   * The flag title.
   */
  title = 'Combo flag';

  /**
   * The flag description.
   */
  description = 'Max combo of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'combo',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
