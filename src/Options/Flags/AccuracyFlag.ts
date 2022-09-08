import { Flag, DataType } from 'cli-processor';

export class AccuracyFlag extends Flag<number> {
  name = 'accuracy';
  shortName = 'a';
  aliases = ['acc'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Accuracy flag';
  description = 'Accuracy of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
  defaultValue = 100;
}
