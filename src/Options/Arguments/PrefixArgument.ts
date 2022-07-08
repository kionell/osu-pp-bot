import { Argument } from 'cli-processor';

export class PrefixArgument extends Argument<string> {
  name = 'prefix';
  title = 'Prefix argument';
  description = 'Command prefix that you want to use.';
  expected = 'prefix';
  minLength = 1;
  maxLength = 8;
  minWords = 1;
  maxWords = 1;
  isRequired = true;
}
