import { Flag, DataType } from 'cli-processor';

export class TotalScoreFlag extends Flag<number> {
  name = 'score';
  shortName = 's';
  title = 'Total score flag';
  description = 'Total score value of a play.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
