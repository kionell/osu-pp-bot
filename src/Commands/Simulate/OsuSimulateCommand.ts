import { GameMode } from '@kionell/osu-api';
import { IScoreOptionsDto } from '@Core/REST';
import { Category, ICommandOptions } from '@Core/Commands';
import { SimulateCommand } from './SimulateCommand';

import {
  ApproachRateFlag,
  CircleSizeFlag,
  OverallDifficultyFlag,
  MissFlag,
  MehFlag,
  OkFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
} from '@Options';

export class OsuSimulateCommand extends SimulateCommand {
  name = 'osusimulate';

  aliases = [ 'osusim', 'standardsimulate', 'standardsim '];

  title = 'Simulate command (osu!standard)';

  category = Category.Standard;

  constructor() {
    super();

    this.addOption(new MissFlag());
    this.addOption(new MehFlag());
    this.addOption(new OkFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new AccuracyFlag());
    this.addOption(new ApproachRateFlag());
    this.addOption(new CircleSizeFlag());
    this.addOption(new OverallDifficultyFlag());
  }

  protected _getTargetRuleset(): GameMode | null {
    return GameMode.Osu;
  }

  protected _getScoreDto(options: ICommandOptions): IScoreOptionsDto {
    const dto = super._getScoreDto(options);

    dto.countMiss = this.getValue(MissFlag) ?? dto.countMiss;
    dto.count50 = this.getValue(MehFlag) ?? dto.count50;
    dto.count100 = this.getValue(OkFlag) ?? dto.count100;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;

    const approachRateFlag = this.getOption(ApproachRateFlag);
    const overallDifficultyFlag = this.getOption(OverallDifficultyFlag);
    const circleSizeFlag = this.getOption(CircleSizeFlag);

    dto.approachRate = approachRateFlag?.getValue() ?? dto.approachRate;
    dto.lockApproachRate = approachRateFlag?.raw?.endsWith('!') ?? false;

    dto.overallDifficulty = overallDifficultyFlag?.getValue() ?? dto.overallDifficulty;
    dto.lockOverallDifficulty = overallDifficultyFlag?.raw?.endsWith('!') ?? false;

    dto.circleSize = circleSizeFlag?.getValue() ?? dto.circleSize;
    dto.lockCircleSize = circleSizeFlag?.raw?.endsWith('!') ?? false;

    return dto;
  }
}
