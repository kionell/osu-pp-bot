import { Argument } from 'cli-processor';

export class UserArgument extends Argument<string> {
  name = 'user';
  title = 'User argument';
  description = 'This is used to specify user.';
  expected = 'ID or username.';
  minWords = 1;
  maxWords = Infinity;
  isRequired = false;
}
