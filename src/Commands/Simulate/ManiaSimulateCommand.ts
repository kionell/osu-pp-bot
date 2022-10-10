import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';
import {
  MissFlag,
  MehFlag,
  GoodFlag,
  OkFlag,
  GreatFlag,
} from '../../Options';

export class ManiaSimulateCommand extends SimulateCommand {
  name = 'maniasimulate';

  aliases = [ 'maniasim' ];

  title = 'Simulate command (osu!mania)';

  category = Category.Mania;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new MehFlag());
    this.addOption(new GoodFlag());
    this.addOption(new OkFlag());
    this.addOption(new GreatFlag());
  }

  protected _getTargetRuleset(): GameMode | null {
    return GameMode.Mania;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count50 = this.getValue(MehFlag) ?? dto.count50;
    dto.count100 = this.getValue(OkFlag) ?? dto.count100;
    dto.countKatu = this.getValue(GoodFlag) ?? dto.countKatu;
    dto.count300 = this.getValue(GreatFlag) ?? dto.countGeki;

    return dto;
  }
}
