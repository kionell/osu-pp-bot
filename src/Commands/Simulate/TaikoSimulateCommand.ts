import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  GoodFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
} from '@Flags';

export class TaikoSimulateCommand extends SimulateCommand {
  name = 'taikosimulate';

  aliases = [ 'taikosim' ];

  title = 'Simulate command (osu!taiko)';

  constructor() {
    super();

    this.registerFlag(new MissFlag());
    this.registerFlag(new GoodFlag());
    this.registerFlag(new ComboFlag());
    this.registerFlag(new PercentComboFlag());
    this.registerFlag(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Taiko;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    const countMiss = this.getFlagValue(MissFlag);
    const count100 = this.getFlagValue(GoodFlag);
    const maxCombo = this.getFlagValue(ComboFlag);
    const percentCombo = this.getFlagValue(PercentComboFlag);
    const accuracy = this.getFlagValue(AccuracyFlag);

    if (countMiss) dto.countMiss = countMiss;
    if (count100) dto.count100 = count100;
    if (maxCombo) dto.maxCombo = maxCombo;
    if (percentCombo) dto.percentCombo = percentCombo;
    if (accuracy) dto.accuracy = accuracy;

    return dto;
  }
}
