import { Flag, DataType } from 'cli-processor';

export class OkFlag extends Flag<number> {
  name = 'oks';
  shortName = 'O';
  aliases = ['katus', 'katu'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Ok flag';
  description = 'The number of ok (katu) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
