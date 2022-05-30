import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  MissFlag,
  DropletFlag,
  TinyDropletFlag,
  ComboFlag,
  AccuracyFlag,
  PercentComboFlag,
} from '@Flags';

export class CatchSimulateCommand extends SimulateCommand {
  name = 'catchsimulate';

  aliases = [ 'ctbsim', 'fruitssim', 'catchsim' ];

  title = 'Simulate command (osu!catch)';

  examples = [
    `${this.name} 1626530 --${MissFlag.examples[0]} --${DropletFlag.examples[0]}`,
    `${this.name} --${AccuracyFlag.examples[1]} --${ComboFlag.examples[1]}`,
    `${this.name} --${PercentComboFlag.examples[1]} --${DropletFlag.examples[1]}`,
    `${this.name} https://osu.ppy.sh/beatmapsets/773801#osu/1626530`,
  ];

  constructor() {
    super();

    this.registerFlag(new MissFlag());
    this.registerFlag(new TinyDropletFlag());
    this.registerFlag(new DropletFlag());
    this.registerFlag(new ComboFlag());
    this.registerFlag(new PercentComboFlag());
    this.registerFlag(new AccuracyFlag());
  }

  protected _getRulesetId(): GameMode | null {
    return GameMode.Fruits;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    const countMiss = this.getFlagValue(MissFlag);
    const countTinyDroplet = this.getFlagValue(TinyDropletFlag);
    const countDroplet = this.getFlagValue(DropletFlag);
    const maxCombo = this.getFlagValue(ComboFlag);
    const percentCombo = this.getFlagValue(PercentComboFlag);
    const accuracy = this.getFlagValue(AccuracyFlag);

    if (countMiss) dto.countMiss = countMiss;
    if (countTinyDroplet) dto.count50 = countTinyDroplet;
    if (countDroplet) dto.count100 = countDroplet;
    if (maxCombo) dto.maxCombo = maxCombo;
    if (percentCombo) dto.percentCombo = percentCombo;
    if (accuracy) dto.accuracy = accuracy;

    return dto;
  }
}
