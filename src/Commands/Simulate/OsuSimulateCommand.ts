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
} from '@Flags';

export class OsuSimulateCommand extends SimulateCommand {
  name = 'osusimulate';

  aliases = [ 'osusim' ];

  title = 'Simulate command (osu!standard)';

  category = Category.Standard;

  constructor() {
    super();

    this.registerFlag(new MissFlag());
    this.registerFlag(new MehFlag());
    this.registerFlag(new GoodFlag());
    this.registerFlag(new ComboFlag());
    this.registerFlag(new PercentComboFlag());
    this.registerFlag(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Osu;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    const countMiss = this.getFlagValue(MissFlag);
    const count50 = this.getFlagValue(MehFlag);
    const count100 = this.getFlagValue(GoodFlag);
    const maxCombo = this.getFlagValue(ComboFlag);
    const percentCombo = this.getFlagValue(PercentComboFlag);
    const accuracy = this.getFlagValue(AccuracyFlag);

    if (countMiss) dto.countMiss = countMiss;
    if (count50) dto.count50 = count50;
    if (count100) dto.count100 = count100;
    if (maxCombo) dto.maxCombo = maxCombo;
    if (percentCombo) dto.percentCombo = percentCombo;
    if (accuracy) dto.accuracy = accuracy;

    return dto;
  }
}
