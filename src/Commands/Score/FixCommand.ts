import { Message } from 'discord.js';
import { IScoreOptionsDto } from '@Core/REST';
import { ScoreCommand } from './ScoreCommand';

export class FixCommand extends ScoreCommand {
  name = 'fix';

  title = 'Fix command';

  description = 'Allows you to unchoke a specific score';

  protected _getScoreDto(msg: Message): IScoreOptionsDto {
    const dto = super._getScoreDto(msg);

    dto.fix = true;

    return dto;
  }
}
