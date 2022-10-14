import { Flag, DataType } from 'cli-processor';

export class PerfectFlag extends Flag<number> {
  name = 'perfects';
  shortName = 'P';
  aliases = ['perfect', 'gekis', 'geki'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Geki flag';
  description = 'The number of perfect (geki) hits of a score.';
  expected = 'number';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  dataType = DataType.Integer;
}
