import { Flag, DataType } from 'cli-processor';

export class CircleSizeFlag extends Flag<number> {
  name = 'circle-size';
  shortName = 'cs';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Circle size flag';

  description = [
    'Circle size of a beatmap in range `[0-11]`.',
    'You can add "!" at the end of the number to lock circle size.',
  ].join(' ');

  shortDescription = 'Circle size of a beatmap in range `[0-11]`';

  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
