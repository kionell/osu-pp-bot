import { Flag, DataType } from 'cli-processor';

export class MehFlag extends Flag<number> {
  name = 'mehs';
  shortName = 'M';
  aliases = ['n50'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Meh flag';
  description = 'The number of meh (50) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
