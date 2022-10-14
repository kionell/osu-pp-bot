import { Flag, DataType } from 'cli-processor';

export class TinyDropletFlag extends Flag<number> {
  name = 'tiny-droplets';
  shortName = 'T';
  aliases = ['tiny-droplet'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Tiny droplet flag';
  description = 'The number of tiny droplets of an osu!catch score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
