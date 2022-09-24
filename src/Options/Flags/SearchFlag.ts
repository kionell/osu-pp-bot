import { Flag } from 'cli-processor';

export class SearchFlag extends Flag<string> {
  name = 'search';
  shortName = '?';
  aliases = ['query'];
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  title = 'Search flag';
  description = 'Search query for beatmap lookup on the bancho.';
  shortDescription = 'Beatmap search query.';
  expected = 'query';
  isRequired = true;
  minWords = 1;
  maxWords = Infinity;
}
