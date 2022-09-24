import { Flag, DataType } from 'cli-processor';

export class ApproachRateFlag extends Flag<number> {
  name = 'approach-rate';
  shortName = 'ar';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Approach rate flag';
  description = 'Approach rate of a beatmap in range `[0-11]`.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
