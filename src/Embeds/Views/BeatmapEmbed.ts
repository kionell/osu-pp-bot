import stringWidth from 'string-width';
import { markdownTable } from 'markdown-table';
import { GameMode, URLGenerator } from '@kionell/osu-api';

import {
  HexColorString,
  Message,
  MessageEmbedAuthor,
  MessageEmbedFooter,
} from 'discord.js';

import {
  ExtendedEmbed,
  Emoji,
  formatNumber,
  formatBeatmapLength,
  formatBPM,
  formatStarRating,
  formatPerformance,
  getDifficultyColor,
  getRulesetIconURL,
} from '@Core/Embeds';

import { IBeatmapResponse } from '@Core/REST';

export abstract class BeatmapEmbed extends ExtendedEmbed {
  constructor(
    protected _beatmap: IBeatmapResponse,
    protected _urlGenerator: URLGenerator,
    protected _message?: Message,
  ) {
    super();
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor {
    const { rulesetId, id, metadata } = this._beatmap;
    const { artist, title, version } = metadata;

    return {
      name: `${artist} - ${title} [${version}]`,
      iconURL: getRulesetIconURL(rulesetId),
      url: this._urlGenerator.generateBeatmapURL(id, rulesetId),
    };
  }

  protected _createEmbedFooter(): MessageEmbedFooter {
    const { creator, creatorId } = this._beatmap.metadata;

    const footer: MessageEmbedFooter = {
      text: `Created by ${creator}, ${this._beatmap.hash}`,
    };

    footer.iconURL = creatorId !== 0
      ? this._urlGenerator.generateAvatarURL(creatorId)
      : 'https://osu.ppy.sh/images/layout/avatar-guest.png';

    return footer;
  }

  protected get _hexColor(): HexColorString {
    return getDifficultyColor(this._beatmap.difficulty.starRating);
  }

  protected _createEmbedDescription(): string {
    const values = [
      `**Mods:** \`${this._beatmap.mods}\``,
    ];

    if (this._beatmap.general.clockRate !== 1) {
      const clockRate = this._beatmap.general.clockRate.toFixed(2);

      values.push(`**Clock Rate:** \`${clockRate}x\``);
    }

    values.push(`**Max Combo:** \`${this._beatmap.general.maxCombo}x\``);

    const lines = [
      '\u200b',
      this._getBeatmapDetails(),
      '\u200b',
      this._getStatsDetails(),
      values.join(' ⦁ '),
      this._getDifficultyDetails(),
      '\u200b',
      this._getPerformanceTable(),
    ];

    return lines.join('\n');
  }

  protected _getBeatmapDetails(): string {
    const general = this._beatmap.general;

    const time = formatBeatmapLength(general.length);
    const bpm = formatBPM(general.bpmMin, general.bpmMax, general.bpmMode);

    const values = [
      `${Emoji.Time}: \`${time}\``,
      `${Emoji.BPM}: \`${bpm}\``,
      `${Emoji.Hittable}: \`${general.hittable}\``,
    ];

    if (this._beatmap.rulesetId !== GameMode.Mania) {
      values.push(`${Emoji.Slidable}: \`${general.slidable}\``);
      values.push(`${Emoji.Spinnable}: \`${general.spinnable}\``);

      return `${values.join(' ⦁ ')}`;
    }

    values.push(`${Emoji.Holdable}: \`${general.holdable}\``);

    return `${values.join(' ⦁ ')}`;
  }

  protected _getStatsDetails(): string {
    const general = this._beatmap.general;

    const values = [
      `**CS:** ${formatNumber(general.circleSize)}`,
      `**AR:** ${formatNumber(general.approachRate)}`,
      `**OD:** ${formatNumber(general.overallDifficulty)}`,
      `**HP:** ${formatNumber(general.drainRate)}`,
    ];

    return values.join(' ⦁ ');
  }

  protected _getDifficultyDetails(): string {
    const starRating = this._beatmap.difficulty.starRating;
    const tooltipURL = this._message?.url;

    return `**Stars:** ${formatStarRating(starRating, tooltipURL)}`;
  }

  protected _getPerformanceTable(): string {
    const titles = this._getPerformanceTitles();
    const values = this._getPerformanceValues();

    const table = markdownTable([titles, ...values], {
      delimiterStart: false,
      delimiterEnd: false,
      stringLength: stringWidth,
    });

    return '```\n' + table + '\n```';
  }

  protected _getPerformanceTitles(): string[] {
    return ['Acc', '95%', '99%', '100%'];
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance;
    const f = formatPerformance;

    return [
      ['Total', ...pp.map((a) => f(a.totalPerformance, true))],
    ];
  }
}
