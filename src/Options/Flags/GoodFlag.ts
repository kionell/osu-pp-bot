import { Flag, DataType } from 'cli-processor';

export class GoodFlag extends Flag<number> {
  name = 'goods';
  shortName = 'G';
  title = 'Goods flag';
  description = 'The number of 100\'s of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
