import { URLScanner } from '@kionell/osu-api';
import { ScoreCommand } from '@Commands/Score';
import { URLHandler } from './URLHandler';

export class ScoreURLHandler extends URLHandler {
  protected _isValidURL(url: string, scanner: URLScanner): boolean {
    return scanner.isScoreURL(url);
  }

  protected _getDefaultCommand(): ScoreCommand {
    return new ScoreCommand();
  }
}
