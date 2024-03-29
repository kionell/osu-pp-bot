import { Server } from '@kionell/osu-api';
import { Flag } from 'cli-processor';

export class ServerFlag extends Flag<keyof typeof Server> {
  name = 'server';
  shortName = 's';
  title = 'Server flag';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];
  description = 'Specific game server';

  choices: (keyof typeof Server)[] = [
    'Bancho',
    'Gatari',
    'Akatsuki',
    'Ripple',
  ];

  expected = 'server name';
  isRequired = true;
  minWords = 1;
  maxWords = 1;
  defaultValue: keyof typeof Server = 'Bancho';
}
