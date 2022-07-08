import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  GoodFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
} from 'src/Options';

export class TaikoSimulateCommand extends SimulateCommand {
  name = 'taikosimulate';

  aliases = [ 'taikosim' ];

  title = 'Simulate command (osu!taiko)';

  category = Category.Taiko;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new GoodFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Taiko;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count100 = this.getValue(GoodFlag) ?? dto.count100;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;

    return dto;
  }
}
