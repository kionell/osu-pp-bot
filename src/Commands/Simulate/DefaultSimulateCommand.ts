import { GameMode, getRulesetId } from '@kionell/osu-api';
import { Category, ICommandOptions } from '@Core/Commands';
import { IScoreOptionsDto } from '@Core/REST';
import { SimulateCommand } from './SimulateCommand';

import {
  ApproachRateFlag,
  CircleSizeFlag,
  OverallDifficultyFlag,
  MissFlag,
  MehFlag,
  GoodFlag,
  OkFlag,
  PerfectFlag,
  AccuracyFlag,
  ComboFlag,
  PercentComboFlag,
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
    this.addOption(new OkFlag());
    this.addOption(new PerfectFlag());
    this.addOption(new AccuracyFlag());
    this.addOption(new ComboFlag());
    this.addOption(new PercentComboFlag());
    this.addOption(new RulesetFlag());
    this.addOption(new ApproachRateFlag());
    this.addOption(new CircleSizeFlag());
    this.addOption(new OverallDifficultyFlag());
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
    dto.countKatu = this.getValue(OkFlag) ?? dto.countKatu;
    dto.countGeki = this.getValue(PerfectFlag) ?? dto.countGeki;
    dto.accuracy = this.getValue(AccuracyFlag) ?? dto.accuracy;
    dto.maxCombo = this.getValue(ComboFlag) ?? dto.maxCombo;
    dto.percentCombo = this.getValue(PercentComboFlag) ?? dto.percentCombo;

    dto.approachRate = this.getValue(ApproachRateFlag) ?? dto.approachRate;
    dto.overallDifficulty = this.getValue(OverallDifficultyFlag) ?? dto.overallDifficulty;
    dto.circleSize = this.getValue(CircleSizeFlag) ?? dto.circleSize;

    return dto;
  }
}
