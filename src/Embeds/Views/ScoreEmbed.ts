import { MessageEmbedAuthor, MessageEmbedImage } from 'discord.js';
import { URLGenerator } from '@kionell/osu-api';

import {
  ExtendedEmbed,
  formatAccuracy,
  formatCombo,
  formatHitStatistics,
  formatPassedTime,
  formatPerformance,
  formatStarRating,
  getRankEmoji,
  getRulesetIconURL,
} from '@Core/Embeds';

import { IScoreResponse } from '@Core/REST';

export abstract class ScoreEmbed extends ExtendedEmbed {
  constructor(
    protected _score: IScoreResponse,
    protected _urlGenerator: URLGenerator,
  ) {
    super();
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor {
    const { id, rulesetId } = this._score.beatmap;
    const { artist, title, version } = this._score.beatmap.metadata;

    return {
      name: `${artist} - ${title} [${version}]`,
      url: this._urlGenerator.generateBeatmapURL(id),
      iconURL: getRulesetIconURL(rulesetId),
    };
  }

  protected _createEmbedImage(): MessageEmbedImage {
    const { beatmapsetId } = this._score.beatmap.metadata;

    return {
      url: this._urlGenerator.generateBeatmapCoverURL(beatmapsetId),
    };
  }

  protected _createEmbedDescription(): string {
    const {
      username, userId, rank, accuracy,
      mods, totalScore, rulesetId, date,
    } = this._score;

    const statistics = this._score.statistics;
    const difficulty = this._score.beatmap.difficulty;

    const result = [
      `**Player**: ${username}`,
      `**Grade**: ${getRankEmoji(rank)}`,
      `**Stars**: ${formatStarRating(difficulty.starRating)}`,
      `**Combo**: ${this._getComboDetails()}`,
      `**Mods**: ${mods}`,
      `**Accuracy**: ${formatAccuracy(accuracy)}`,
    ];

    if ((userId || username) && username !== 'osu!') {
      const userURL = this._urlGenerator.generateUserURL(userId || username);

      result[0] = `**Player**: [${username}](${userURL})`;
    }

    if (totalScore > 0) {
      result.push(`**Score**: ${totalScore.toLocaleString()}`);
    }

    const timestamp = formatPassedTime(new Date(date).getTime());

    result.push(`**Statistics**: ${formatHitStatistics(statistics, rulesetId)}`);
    result.push(`**Performance**: ${this._getPerformanceDetails()}`);
    result.push(`**Date:** ${timestamp}`);

    return result.join('\n');
  }

  protected _getComboDetails(): string {
    const scoreMaxCombo = this._score.maxCombo;
    const beatmapMaxCombo = this._score.beatmap.difficulty.maxCombo;

    return formatCombo(scoreMaxCombo, beatmapMaxCombo);
  }

  protected _getPerformanceDetails(): string {
    const performance = formatPerformance(this._score.performance.totalPerformance);

    return `${performance} pp`;
  }
}
