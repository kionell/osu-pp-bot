import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  MehFlag,
  GoodFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
} from 'src/Options';

export class OsuSimulateCommand extends SimulateCommand {
  name = 'osusimulate';

  aliases = [ 'osusim' ];

  title = 'Simulate command (osu!standard)';

  category = Category.Standard;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new MehFlag());
    this.addOption(new GoodFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Osu;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count50 = this.getValue(MehFlag) ?? dto.count50;
    dto.count100 = this.getValue(GoodFlag) ?? dto.count100;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;

    return dto;
  }
}
