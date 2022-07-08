import { GameMode, RankStatus } from '@kionell/osu-api';
import { ScoreRank } from 'osu-classes';
import { Emoji } from '../Enums';
import { Category } from '../../Commands/Enums';

export function getRankStatusEmoji(status: RankStatus): Emoji {
  switch (status) {
    case RankStatus.Loved:
      return Emoji.Loved;

    case RankStatus.Qualified:
    case RankStatus.Approved:
      return Emoji.Approved;

    case RankStatus.Ranked:
      return Emoji.Ranked;
  }

  return Emoji.Unknown;
}

export function getRulesetEmoji(mode: GameMode): Emoji {
  switch (mode) {
    case GameMode.Taiko:
      return Emoji.Taiko;

    case GameMode.Fruits:
      return Emoji.Fruits;

    case GameMode.Mania:
      return Emoji.Mania;
  }

  return Emoji.Standard;
}

export function getCategoryIconURL(category: Category): string {
  const emoji = getCategoryEmoji(category);
  const emojiId = emoji.replace(/\D+/g, '');

  return `https://cdn.discordapp.com/emojis/${emojiId}.png`;
}

export function getCategoryEmoji(category: Category): Emoji {
  switch (category) {
    case Category.Information: return Emoji.Information;
    case Category.Utility: return Emoji.Utility;
    case Category.Osu: return Emoji.Osu;
    case Category.Standard: return Emoji.Standard;
    case Category.Taiko: return Emoji.Taiko;
    case Category.Fruits: return Emoji.Fruits;
    case Category.Mania: return Emoji.Mania;
  }
}

export function getRulesetIconURL(mode: GameMode): string {
  const emoji = getRulesetEmoji(mode);
  const emojiId = emoji.replace(/\D+/g, '');

  return `https://cdn.discordapp.com/emojis/${emojiId}.png`;
}

export function getRankEmoji(rank: keyof typeof ScoreRank): Emoji {
  switch (rank) {
    case 'XH': return Emoji.XH;
    case 'SH': return Emoji.SH;
    case 'X': return Emoji.X;
    case 'S': return Emoji.S;
    case 'A': return Emoji.A;
    case 'B': return Emoji.B;
    case 'C': return Emoji.C;
    case 'D': return Emoji.D;
    case 'F': return Emoji.F;
  }
}
