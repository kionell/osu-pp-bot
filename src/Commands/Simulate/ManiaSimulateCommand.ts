import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';
import { ScoreFlag } from '@Flags';

export class ManiaSimulateCommand extends SimulateCommand {
  name = 'maniasimulate';

  aliases = [ 'maniasim' ];

  title = 'Simulate command (osu!mania)';

  constructor() {
    super();

    this.registerFlag(new ScoreFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Mania;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    const totalScore = this.getFlagValue(ScoreFlag);

    if (totalScore) dto.totalScore = totalScore;

    return dto;
  }
}
