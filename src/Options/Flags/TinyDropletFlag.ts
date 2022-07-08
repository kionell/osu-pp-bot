import { Flag, DataType } from 'cli-processor';

export class TinyDropletFlag extends Flag<number> {
  name = 'tiny-droplets';
  shortName = 'T';
  title = 'Tiny droplets flag';
  description = 'The number of tiny droplets of an osu!catch score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
