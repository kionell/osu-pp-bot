import stringWidth from 'string-width';
import { markdownTable } from 'markdown-table';
import { GameMode, URLGenerator } from '@kionell/osu-api';

import {
  HexColorString,
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedImage,
} from 'discord.js';

import {
  ExtendedEmbed,
  Emoji,
  formatBeatmapLength,
  formatBPM,
  formatPerformance,
  getDifficultyColor,
  getRulesetIconURL,
} from '@Core/Embeds';

import { IBeatmapResponse } from '@Core/REST';

export abstract class BeatmapEmbed extends ExtendedEmbed {
  constructor(
    protected _beatmap: IBeatmapResponse,
    protected _urlGenerator: URLGenerator,
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

  protected _createEmbedImage(): MessageEmbedImage {
    return {
      url: 'attachment://strains.png',
    };
  }

  protected _createEmbedFooter(): MessageEmbedFooter {
    const { creator, creatorId } = this._beatmap.metadata;

    const footer: MessageEmbedFooter = {
      text: `Created by ${creator}`,
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
      `**Max Combo:** \`${this._beatmap.general.maxCombo}x\``,
    ];

    const lines = [
      '\u200b',
      this._getBeatmapDetails(),
      '\u200b',
      this._getStatsDetails(),
      values.join(' ⦁ '),
      `**Stars:** ${this._getStarRatingDetails()}`,
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
      `**CS:** \`${(general.circleSize).toFixed(2)}\``,
      `**AR:** \`${(general.approachRate).toFixed(2)}\``,
      `**OD:** \`${(general.overallDifficulty).toFixed(2)}\``,
      `**HP:** \`${(general.drainRate).toFixed(2)}\``,
    ];

    return values.join(' ⦁ ');
  }

  protected _getStarRatingDetails(): string {
    const difficulty = this._beatmap.difficulty;

    return `\`${difficulty.starRating.toFixed(2)}★\``;
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
