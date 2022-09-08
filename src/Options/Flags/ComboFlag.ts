import { Flag, DataType } from 'cli-processor';

export class ComboFlag extends Flag<number> {
  name = 'combo';
  shortName = 'C';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Combo flag';
  description = 'Max combo of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
