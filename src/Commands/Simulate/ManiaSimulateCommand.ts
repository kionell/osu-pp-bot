import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';
import { TotalScoreFlag } from '@Options';

export class ManiaSimulateCommand extends SimulateCommand {
  name = 'maniasimulate';

  aliases = [ 'maniasim' ];

  title = 'Simulate command (osu!mania)';

  category = Category.Mania;

  constructor() {
    super();

    this.addOption(new TotalScoreFlag());
  }

  protected _getDefaultRulesetId(): GameMode | null {
    return GameMode.Mania;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.totalScore = this.getValue(TotalScoreFlag) ?? dto.totalScore;

    return dto;
  }
}
