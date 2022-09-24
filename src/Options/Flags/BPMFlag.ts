import { Flag, DataType } from 'cli-processor';

export class BPMFlag extends Flag<number> {
  name = 'bpm';
  shortName = 'bpm';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'BPM flag';
  description = 'BPM of a beatmap in range `[60-10000]`.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Float;
}
