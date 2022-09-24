import { GameMode } from '@kionell/osu-api';
import { Flag } from 'cli-processor';

export class RulesetFlag extends Flag<keyof typeof GameMode | number> {
  name = 'ruleset';
  shortName = 'r';
  title = 'Ruleset flag';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  description = 'Convert beatmap to a specific ruleset.';
  shortDescription = 'Ruleset of the target beatmap.';

  choices: (keyof typeof GameMode)[] = [
    'Osu',
    'Taiko',
    'Fruits',
    'Mania',
  ];

  expected = 'ID or shortname';
  isRequired = true;
  defaultValue = GameMode.Osu;
  minWords = 1;
  maxWords = 1;
}
