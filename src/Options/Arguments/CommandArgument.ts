import { Argument } from 'cli-processor';

export class CommandArgument extends Argument<string> {
  name = 'command';
  title = 'Command argument';
  description = 'Any command line with support for subcommands';
  expected = 'command line';
  maxWords = Infinity;
  isRequired = false;
}
