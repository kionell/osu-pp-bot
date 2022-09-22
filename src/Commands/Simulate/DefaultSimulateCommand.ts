import { GameMode, getRulesetId } from '@kionell/osu-api';
import { Category, ICommandOptions } from '@Core/Commands';
import { IScoreOptionsDto } from '@Core/REST';
import { SimulateCommand } from './SimulateCommand';

import {
  ApproachRateFlag,
  CircleSizeFlag,
  ClockRateFlag,
  OverallDifficultyFlag,
  MissFlag,
  MehFlag,
  GoodFlag,
  ComboFlag,
  PercentComboFlag,
  AccuracyFlag,
  TotalScoreFlag,
  RulesetFlag,
} from '@Options';

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
    this.addOption(new RulesetFlag());
    this.addOption(new TotalScoreFlag());
    this.addOption(new ApproachRateFlag());
    this.addOption(new CircleSizeFlag());
    this.addOption(new OverallDifficultyFlag());
    this.addOption(new ClockRateFlag());
  }

  protected _getTargetRuleset(): GameMode | null {
    const targetRuleset = this.getValue(RulesetFlag);
    const input = targetRuleset !== null
      ? (!isNaN(+targetRuleset) ? +targetRuleset : targetRuleset)
      : null;

    if (typeof input === 'number' || typeof input === 'string') {
      return getRulesetId(input);
    }

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

    dto.approachRate = this.getValue(ApproachRateFlag) ?? dto.approachRate;
    dto.overallDifficulty = this.getValue(OverallDifficultyFlag) ?? dto.overallDifficulty;
    dto.circleSize = this.getValue(CircleSizeFlag) ?? dto.circleSize;
    dto.clockRate = this.getValue(ClockRateFlag) ?? dto.clockRate;

    return dto;
  }
}
