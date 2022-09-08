import { DataType, Flag } from 'cli-processor';

export class ModsFlag extends Flag<string> {
  name = 'mods';
  shortName = 'm';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Mods flag';
  description = 'A string with mod combination or bitwise. Default value is NM.';
  expected = 'combination or bitwise';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  defaultValue = 'NM';
  dataType = DataType.String;
}
