import { Argument, Flag } from 'cli-processor';

export class TinyDropletFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'tiny-droplets';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 32`,
    `${this.globalName} 64`,
  ];

  /**
   * The flag name.
   */
  name = TinyDropletFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'T';

  /**
   * The flag title.
   */
  title = 'Droplets flag';

  /**
   * The flag description.
   */
  description = 'The number of tiny droplets of an osu!catch score.';

  /**
   * The flag argument.
   */
  arg = new Argument<number>({
    description: 'tiny droplets',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    type: 'integer',
  });
}
