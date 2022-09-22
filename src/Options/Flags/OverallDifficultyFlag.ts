import { Flag, DataType } from 'cli-processor';

export class OverallDifficultyFlag extends Flag<number> {
  name = 'overall-difficulty';
  shortName = 'od';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Overall difficulty flag';
  description = 'Overall difficulty of the target beatmap in range `[0-11]`.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}