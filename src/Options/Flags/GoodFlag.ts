import { Flag, DataType } from 'cli-processor';

export class GoodFlag extends Flag<number> {
  name = 'goods';
  shortName = 'G';
  aliases = ['n100'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Good flag';
  description = 'The number of good (100) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
