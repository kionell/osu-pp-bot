import { Flag, DataType } from 'cli-processor';

export class TotalHitsFlag extends Flag<number> {
  name = 'total-hits';
  shortName = 'hits';
  aliases = ['objects'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Total hits flag';
  description = 'How many objects to use for calculation.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
