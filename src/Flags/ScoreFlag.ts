import { Argument, Flag } from 'cli-processor';

export class ScoreFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'score';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 432423`,
    `${this.globalName} 1000000`,
    `${this.globalName} 1234`,
  ];

  /**
   * The flag name.
   */
  name = ScoreFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 's';

  /**
   * The flag title.
   */
  title = 'Score flag';

  /**
   * The flag description.
   */
  description = 'Total score value of a score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'score',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
