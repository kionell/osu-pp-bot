import { Flag } from 'cli-processor';

export class SearchFlag extends Flag<string> {
  name = 'search';
  shortName = '?';
  title = 'Search flag';
  description = 'This helps to search beatmap by its creator, artist, title, difficulty name or tags.';
  shortDescription = 'This helps to search beatmap by query.';
  expected = 'query';
  isRequired = true;
  minWords = 1;
  maxWords = Infinity;
}
