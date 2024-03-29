import { Flag, DataType } from 'cli-processor';

export class ConvertedFlag extends Flag<boolean> {
  name = 'converted';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Converted flag';

  description = [
    'Whether a beatmap is converted or not?',
    'This is used only for osu!mania attributes as they are different',
    'depending on what type of a beatmap is processed',
  ].join(' ');

  shortDescription = 'Whether a beatmap is converted or not?';

  expected = 'boolean';
  isRequired = false;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Boolean;
  defaultValue = false;
}
