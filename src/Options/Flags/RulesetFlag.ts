import { GameMode } from '@kionell/osu-api';
import { Flag } from 'cli-processor';

export class RulesetFlag extends Flag<keyof typeof GameMode | number> {
  name = 'ruleset';
  shortName = 'r';
  title = 'Ruleset flag';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];

  description = [
    'Used to specify target ruleset ID (`0|1|2|3`) or shortname (`osu|taiko|ctb|catch|fruits|mania`).',
    'By default it uses original ruleset of a beatmap or score.',
  ].join(' ');

  shortDescription = 'Used to specify target ruleset.';

  matchPattern = /[0-3]|osu|taiko|ctb|catch|fruits|mania/i;

  choices: (keyof typeof GameMode)[] = [
    'Osu',
    'Taiko',
    'Fruits',
    'Mania',
  ];

  expected = 'ID or shortname';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
}
