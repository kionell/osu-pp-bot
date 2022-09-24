import { Flag, DataType } from 'cli-processor';

export class ClockRateFlag extends Flag<number> {
  name = 'clockrate';
  shortName = 'rate';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Clock rate flag';
  description = 'Clock rate of a beatmap in range `[0.25-3.00]`.';
  expected = 'number';
  isRequired = true;
  defaultValue = 1;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
