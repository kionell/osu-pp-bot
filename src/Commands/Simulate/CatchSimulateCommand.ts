import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  DropletFlag,
  TinyDropletFlag,
  ComboFlag,
  AccuracyFlag,
  PercentComboFlag,
} from 'src/Options';

export class CatchSimulateCommand extends SimulateCommand {
  name = 'catchsimulate';

  aliases = [ 'ctbsim', 'fruitssim', 'catchsim' ];

  title = 'Simulate command (osu!catch)';

  category = Category.Fruits;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new TinyDropletFlag());
    this.addOption(new DropletFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Fruits;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count50 = this.getValue(TinyDropletFlag) ?? dto.count50;
    dto.count100 = this.getValue(DropletFlag) ?? dto.count100;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;

    return dto;
  }
}
