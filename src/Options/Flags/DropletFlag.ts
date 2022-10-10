import { Flag, DataType } from 'cli-processor';

export class DropletFlag extends Flag<number> {
  name = 'droplets';
  shortName = 'D';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Droplet flag';
  description = 'The number of droplets of an osu!catch score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
