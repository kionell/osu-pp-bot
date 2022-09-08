import { Server } from '@kionell/osu-api';
import { Flag } from 'cli-processor';

export class ServerFlag extends Flag<keyof typeof Server> {
  name = 'server';
  shortName = 's';
  title = 'Server flag';
  prefixAliases = [''];
  shortPrefixAliases = [''];
  separatorAliases = ['='];

  description = [
    'Allows you to choose a game server (`Bancho|Gatari|Akatsuki|Ripple`).',
    'Another servers are not supported right now so it does nothing.',
    'Default server is Bancho.',
  ].join(' ');

  shortDescription = 'Allows you to choose a game server.';

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
