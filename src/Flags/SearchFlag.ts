import { Argument, Flag } from 'cli-processor';

export class SearchFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'search';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} freedom dive`,
    `${this.globalName} hollow wings`,
    `${this.globalName} sky arrow`,
  ];

  /**
   * The flag name.
   */
  name = SearchFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = '?';

  /**
   * The flag title.
   */
  title = 'Search flag';

  /**
   * The flag description.
   */
  description = 'This helps to search beatmap by its creator, artist, title, difficulty name or tags.';

  /**
   * The flag argument.
   */
  arg = new Argument<string>({
    description: 'text',
    isRequired: true,
    minLength: 1,
    maxLength: Infinity,
  });
}
