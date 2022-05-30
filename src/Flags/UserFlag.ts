import { Argument, Flag } from 'cli-processor';

export class UserFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'user';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 7562902`,
    `${this.globalName} aetrna`,
  ];

  /**
   * The flag name.
   */
  name = UserFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'u';

  /**
   * The flag title.
   */
  title = 'User flag';

  /**
   * The flag description.
   */
  description = 'Used to specify username or user ID.';

  /**
   * The flag argument.
   */
  arg = new Argument<string>({
    description: 'name or ID',
    isRequired: true,
    minLength: 1,
    maxLength: Infinity,
  });
}
