import { Flag, DataType } from 'cli-processor';

export class MissFlag extends Flag<number> {
  name = 'misses';
  shortName = 'X';
  title = 'Misses flag';
  description = 'The number of misses of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  defaultValue = 0;
  dataType = DataType.Integer;
}
