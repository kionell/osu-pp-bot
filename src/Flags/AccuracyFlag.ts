import { Argument, Flag } from 'cli-processor';

export class AccuracyFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'accuracy';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 95`,
    `${this.globalName} 0.99`,
  ];

  /**
   * The flag name.
   */
  name = AccuracyFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'a';

  /**
   * The flag title.
   */
  title = 'Accuracy flag';

  /**
   * The flag description.
   */
  description = 'Accuracy of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'accuracy',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'float',
    defaultValue: 100,
  });
}
