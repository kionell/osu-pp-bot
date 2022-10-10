import { Argument } from 'cli-processor';

export class ScoreArgument extends Argument<string> {
  name = 'score';
  title = 'Score argument';
  description = 'Score ID or URL';
  expected = 'ID or URL.';
  minWords = 1;
  maxWords = 1;
  isRequired = false;
}
