import { IScoreOptionsDto } from '@Core/REST';
import { ICommandOptions } from '@Core/Commands';
import { ScoreCommand } from './ScoreCommand';

export class FixCommand extends ScoreCommand {
  name = 'fix';

  title = 'Fix command';

  description = 'Allows you to unchoke a specific score';

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.fix = true;

    return dto;
  }
}
