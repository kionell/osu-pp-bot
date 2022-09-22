import { Flag, DataType } from 'cli-processor';

export class ClockRateFlag extends Flag<number> {
  name = 'clockrate';
  shortName = 'rate';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Clock rate flag';
  description = 'Clock rate of the target beatmap.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
