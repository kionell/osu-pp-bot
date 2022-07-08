import { Argument } from 'cli-processor';

export class BeatmapArgument extends Argument<string> {
  name = 'beatmap';
  title = 'Beatmap argument';
  description = 'This argument is used to specify a beatmap.';
  expected = 'ID or URL';
  minWords = 1;
  maxWords = 1;
  isRequired = false;
}
