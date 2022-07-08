import { Flag, DataType } from 'cli-processor';

export class MehFlag extends Flag<number> {
  name = 'mehs';
  shortName = 'M';
  title = 'Mehs flag';
  description = 'The number of 50\'s of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
