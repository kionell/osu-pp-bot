import { ModCombination, DifficultyRange, MathUtils, RoundHelper } from 'osu-classes';
import { getRulesetId, getRuleset, GameMode } from '@kionell/osu-api';
import { BotCommand, ICommandOptions, Category } from '@Core/Commands';
import { EmbedFactory, IOutputAttributes } from '@Embeds';
import {
  ApproachRateFlag,
  CircleSizeFlag,
  OverallDifficultyFlag,
  ClockRateFlag,
  ModsFlag,
  RulesetFlag,
  ConvertedFlag,
} from '@Options';

export class AttributesCommand extends BotCommand {
  name = 'attributes';

  aliases = [
    'atts',
  ];

  title = 'Attributes command';

  description = [
    'Calculates beatmap attributes for AR, OD and CS by specified values.',
    'Supports different game modes, mods and custom clock rate.',
  ].join(' ');

  shortDescription = 'Gives you information about a beatmap.';

  category = Category.Osu;

  constructor() {
    super();

    this.addOption(new ApproachRateFlag());
    this.addOption(new CircleSizeFlag());
    this.addOption(new OverallDifficultyFlag());
    this.addOption(new ClockRateFlag());
    this.addOption(new ModsFlag());
    this.addOption(new RulesetFlag());
    this.addOption(new ConvertedFlag());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const attributes = this._calculateAttributes();

    const embed = EmbedFactory.createAttributesEmbed(attributes);
    const embedShipment = this._getEmbedShipment(options);

    await embedShipment.embeds(await embed.build()).send();
  }

  private _calculateAttributes(): IOutputAttributes {
    const targetRuleset = this.getValueOrDefault(RulesetFlag);
    const targetMods = this.getValueOrDefault(ModsFlag);
    const targetClockRate = this.getValueOrDefault(ClockRateFlag);

    const rulesetInput = !isNaN(+targetRuleset) ? +targetRuleset : targetRuleset;
    const rulesetId = getRulesetId(rulesetInput);
    const combination = this._toModCombination(targetMods, rulesetId);

    const isForStandard = rulesetId === GameMode.Osu;
    const isForCatch = rulesetId === GameMode.Fruits;

    const attributes: IOutputAttributes = {
      clockRate: targetClockRate,
      mods: combination.toString(),
      rulesetId,
    };

    if (isForStandard || isForCatch) {
      this._tryToAddCSValues(attributes, combination);
      this._tryToAddARValues(attributes, combination, targetClockRate);
    }

    if (!isForCatch) {
      this._tryToAddODValues(attributes, combination, rulesetId, targetClockRate);
    }

    return attributes;
  }

  private _tryToAddCSValues(attributes: IOutputAttributes, mods: ModCombination): void {
    const originalCS = this.getValue(CircleSizeFlag);

    if (originalCS === null) return;

    const DEFAULT_RADIUS = 64;

    const multiplier = mods.has('HR') ? 1.3 : (mods.has('EZ') ? 0.5 : 1);
    const moddedCS = MathUtils.clamp(originalCS * multiplier, 0, 11);
    const scale = Math.fround((1 - Math.fround(0.7) * (moddedCS - 5) / 5) / 2);

    attributes.circleSize = moddedCS;
    attributes.radius = DEFAULT_RADIUS * scale;
  }

  private _tryToAddARValues(attributes: IOutputAttributes, mods: ModCombination, clockRate: number): void {
    const originalAR = this.getValue(ApproachRateFlag);

    if (originalAR === null) return;

    const multiplier = mods.has('HR') ? 1.4 : (mods.has('EZ') ? 0.5 : 1);
    const moddedAR = MathUtils.clamp(originalAR * multiplier, 0, 11);

    const preempt = DifficultyRange.map(moddedAR, 1800, 1200, 450) / clockRate;
    const calculatedAR = preempt > 1200
      ? (1800 - preempt) / 120
      : (1200 - preempt) / 150 + 5;

    attributes.preempt = preempt;
    attributes.approachRate = calculatedAR;
  }

  private _tryToAddODValues(attributes: IOutputAttributes, mods: ModCombination, rulesetId: GameMode, clockRate: number): void {
    const originalOD = this.getValue(OverallDifficultyFlag);

    if (originalOD === null) return;

    const multiplier = mods.has('HR') ? 1.4 : (mods.has('EZ') ? 0.5 : 1);
    const moddedOD = MathUtils.clamp(originalOD * multiplier, 0, 11);

    if (rulesetId === GameMode.Mania) {
      /**
       * Why osu!mania hit windows are so weird???
       */
      const hitWindow300 = this._calculateManiaHitWindow300(mods, originalOD);
      const greatHitWindow = Math.ceil(Math.trunc(hitWindow300 * clockRate) / clockRate);

      attributes.greatHitWindow = greatHitWindow;
      attributes.overallDifficulty = moddedOD;
    }
    else {
      const greatHitWindow = this._calculateGreatHitWindow(rulesetId, moddedOD) / clockRate;
      const calculatedOD = (80 - greatHitWindow) / 6;

      attributes.greatHitWindow = greatHitWindow;
      attributes.overallDifficulty = calculatedOD;
    }
  }

  private _calculateGreatHitWindow(rulesetId: GameMode, value: number): number {
    if (rulesetId === GameMode.Taiko) {
      return Math.floor(DifficultyRange.map(value, 50, 35, 20));
    }

    // Default great hit window value is taken from osu!standard
    return DifficultyRange.map(value, 80, 50, 20);
  }

  private _calculateManiaHitWindow300(mods: ModCombination, originalOD: number): number {
    const isConverted = this.getValueOrDefault(ConvertedFlag);

    const applyModAdjustments = (value: number) => {
      if (mods.has('HR')) return value / 1.4;
      if (mods.has('EZ')) return value * 1.4;

      return value;
    };

    if (!isConverted) {
      return applyModAdjustments(34 + 3 * MathUtils.clamp(10 - originalOD, 0, 10));
    }

    if (RoundHelper.round(originalOD) > 4) {
      return applyModAdjustments(34);
    }

    return applyModAdjustments(47);
  }

  private _toModCombination(input: string | number, rulesetId: GameMode) {
    const ruleset = getRuleset(rulesetId);

    return ruleset.createModCombination(input);
  }
}
