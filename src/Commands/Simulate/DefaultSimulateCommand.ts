import { GameMode } from '@kionell/osu-api';
import { Category, ICommandOptions } from '@Core/Commands';
import { IScoreOptionsDto } from '@Core/REST';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  MehFlag,
  GoodFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
  TotalScoreFlag,
} from 'src/Options';

export class DefaultSimulateCommand extends SimulateCommand {
  name = 'simulate';

  aliases = [ 'sim', 's' ];

  title = 'Simulate command';

  category = Category.Osu;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new MehFlag());
    this.addOption(new GoodFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new AccuracyFlag());
    this.addOption(new TotalScoreFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return null;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count50 = this.getValue(MehFlag) ?? dto.count50;
    dto.count100 = this.getValue(GoodFlag) ?? dto.count100;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;
    dto.totalScore = this.getValue(TotalScoreFlag) ?? dto.totalScore;

    return dto;
  }
}
