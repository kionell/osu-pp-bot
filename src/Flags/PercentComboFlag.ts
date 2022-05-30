import { Argument, Flag } from 'cli-processor';

export class PercentComboFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'percent-combo';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 81`,
    `${this.globalName} 99%`,
  ];

  /**
   * The flag name.
   */
  name = PercentComboFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'C';

  /**
   * The flag title.
   */
  title = 'Percent combo flag';

  /**
   * The flag description.
   */
  description = 'Used to specify percentage of score max combo.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'percentage',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'float',
  });
}
