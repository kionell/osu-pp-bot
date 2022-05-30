import { Argument, Flag } from 'cli-processor';

export class DropletFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'droplets';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 4`,
    `${this.globalName} 10`,
  ];

  /**
   * The flag name.
   */
  name = DropletFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'D';

  /**
   * The flag title.
   */
  title = 'Droplets flag';

  /**
   * The flag description.
   */
  description = 'The number of droplets of an osu!catch score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'droplets',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
