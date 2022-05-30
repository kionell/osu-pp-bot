import { URLScanner } from '@kionell/osu-api';
import { BeatmapCommand } from '@Commands/Beatmap';
import { URLHandler } from './URLHandler';

export class BeatmapURLHandler extends URLHandler {
  protected _isValidURL(url: string, scanner: URLScanner): boolean {
    return scanner.isBeatmapURL(url);
  }

  protected _getDefaultCommand(): BeatmapCommand {
    return new BeatmapCommand();
  }
}
