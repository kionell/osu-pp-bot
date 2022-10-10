import { Flag, DataType } from 'cli-processor';

export class GoodFlag extends Flag<number> {
  name = 'goods';
  shortName = 'G';
  aliases = ['katus', 'katu'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Good flag';
  description = 'The number of good (katu) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
