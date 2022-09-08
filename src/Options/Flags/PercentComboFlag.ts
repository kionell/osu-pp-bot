import { DataType, Flag } from 'cli-processor';

export class PercentComboFlag extends Flag<number> {
  name = 'percent-combo';
  shortName = 'P';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Combo percent flag';
  description = 'Used to specify percentage of score max combo.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
