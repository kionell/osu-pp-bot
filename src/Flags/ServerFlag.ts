import { Argument, Flag } from 'cli-processor';
import { Server } from '@kionell/osu-api';

export class ServerFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'server';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} bancho`,
    `${this.globalName} gatari`,
    `${this.globalName} akatsuki`,
  ];

  /**
   * The flag name.
   */
  name = ServerFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 's';

  /**
   * The flag title.
   */
  title = 'Server flag';

  /**
   * The flag description.
   */
  description = [
    'Specific game server (`Bancho|Gatari|Akatsuki|Ripple`).',
    'Another servers are not supported right now so it does nothing.',
    'Default server is Bancho.',
  ].join(' ');

  /**
   * The flag argument.
   */
  arg = new Argument<keyof typeof Server>({
    description: 'server',
    defaultValue: 'Bancho',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
  });
}
