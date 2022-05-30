import { Argument, Flag } from 'cli-processor';
import { GameMode } from '@kionell/osu-api';

export class RulesetFlag extends Flag {
  /**
   * Global flag name.
   */
  static globalName = 'ruleset';

  /**
   * Global flag examples.
   */
  static examples = [
    `${this.globalName} 0`,
    `${this.globalName} 3`,
    `${this.globalName} taiko`,
    `${this.globalName} fruits`,
    `${this.globalName} catch`,
  ];

  /**
   * The flag name.
   */
  name = RulesetFlag.globalName;

  /**
   * The flag shortened name.
   */
  shortName = 'r';

  /**
   * The flag title.
   */
  title = 'Ruleset flag';

  /**
   * The flag description.
   */
  description = [
    'Used to specify beatmap ruleset ID (`0|1|2|3`) or shortname (`osu|taiko|fruits|catch|mania`).',
    'By default it uses original ruleset of a beatmap or score.',
  ].join(' ');

  /**
   * The flag argument.
   */
  arg = new Argument<Lowercase<keyof typeof GameMode> | GameMode>({
    description: 'name or ID',
    isRequired: true,
    minLength: 1,
    maxLength: 1,
    defaultValue: GameMode.Osu,
  });
}
