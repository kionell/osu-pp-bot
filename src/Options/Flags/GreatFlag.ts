import { Flag, DataType } from 'cli-processor';

export class GreatFlag extends Flag<number> {
  name = 'greats';
  shortName = 'GR';
  aliases = ['n300'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Great flag';
  description = 'The number of great (300) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
