import { GameMode } from '@kionell/osu-api';
import { Category } from '../../Commands/Enums';
import { IHitStatistics } from '../../REST';

export function formatCategoryName(category: Category): string {
  switch (category) {
    case Category.Information: return 'Information';
    case Category.Utility: return 'Utility';
    case Category.Osu: return 'All osu! modes';
    case Category.Standard: return 'osu!standard';
    case Category.Taiko: return 'osu!taiko';
    case Category.Fruits: return 'osu!catch';
    case Category.Mania: return 'osu!mania';
  }
}

export function formatNumber(value: number, digits = 2, units?: string): string {
  const values = [
    value.toFixed(digits),
  ];

  if (units) values.push(units);

  return `\`${values.join(' ')}\``;
}

export function formatBPM(bpmMin: number, bpmMax: number, bpmMode: number): string {
  bpmMin = Math.round(bpmMin);
  bpmMax = Math.round(bpmMax);
  bpmMode = Math.round(bpmMode);

  return bpmMin === bpmMax ? bpmMode.toString() : `${bpmMin}-${bpmMax} (${bpmMode})`;
}

export function formatAccuracy(accuracy: number): string {
  accuracy = accuracy <= 1 ? accuracy * 100 : accuracy;

  return `${accuracy.toFixed(2)}%`;
}

export function formatTotalScore(totalScore: number, multiplier?: number): string {
  totalScore *= (multiplier ?? 1);

  if (totalScore >= 1e6) return (totalScore / 1e6).toFixed(0) + 'm';
  if (totalScore >= 1e3) return (totalScore / 1e3).toFixed(0) + 'k';

  return totalScore.toFixed(0);
}

export function formatCombo(scoreCombo: number, beatmapCombo?: number): string {
  if (beatmapCombo) {
    return `${scoreCombo}x/${beatmapCombo}x`;
  }

  return `${scoreCombo}x`;
}

export function formatStarRating(starRating: number, url?: string): string {
  if (!url) return `\`${starRating.toFixed(2)}★\``;

  return `[${starRating.toFixed(2)}★](${url} "${starRating}")`;
}

export function formatPerformance(performance: number, short = false, url?: string): string {
  const error = 0.000001;

  let text = performance.toFixed(2);

  if (short && performance >= 1e9 - error) {
    text = performance.toExponential(1);
  }
  else if (short && performance >= 1e6 - error) {
    text = `${(performance / 1e6).toFixed(1)}m`;
  }
  else if (short && performance >= 1e4 - error) {
    text = `${(performance / 1e3).toFixed(1)}k`;
  }

  return url ? `[${text}](${url} "${performance}")` : `${text}`;
}

export function formatHitStatistics(statistics: IHitStatistics, rulesetId: GameMode): string {
  const result = [];

  if (rulesetId === GameMode.Mania) {
    result.push(statistics.countGeki);
  }

  result.push(statistics.count300);

  if (rulesetId === GameMode.Mania) {
    result.push(statistics.countKatu);
  }

  result.push(statistics.count100);

  if (rulesetId !== GameMode.Taiko) {
    result.push(statistics.count50);
  }

  if (rulesetId === GameMode.Fruits) {
    result.push(statistics.countKatu);
  }

  result.push(statistics.countMiss);

  return `\`[${result.join('/')}]\``;
}

export function formatBeatmapLength(time: number): string {
  time = Math.round(time);

  const seconds = Math.trunc(time) % 60;
  const minutes = Math.trunc(time / 60) % 60;
  const hours = Math.trunc(time / 3600);

  const values = [
    minutes.toString(),
    seconds.toString().padStart(2, '0'),
  ];

  if (hours > 0) {
    values.unshift(hours.toString());
    values[1] = values[1].padStart(2, '0');
  }

  return values.join(':');
}

export function formatPassedTime(time: number): string {
  return `<t:${Math.trunc(time / 1000)}:R>`;
}

export function formatPlaytime(playtime: number): string {
  const seconds = playtime % 60;
  const minutes = Math.trunc(playtime / 60) % 60;
  const hours = Math.trunc(playtime / 3600) % 24;
  const days = Math.trunc(playtime / 86400);

  const dateArgs = [0, 0, days, hours, minutes, seconds];

  return formatDateArgs(dateArgs);
}

export function formatDateArgs(dateArgs: number[]): string {
  const [seconds, minutes, hours, days, months, years] = dateArgs;

  const result = [];

  if (years) {
    result.push(`${years} year${years !== 1 ? 's' : ''}`);
  }

  if (months) {
    result.push(`${months} month${months !== 1 ? 's' : ''}`);
  }

  if (days) {
    result.push(`${days} day${days !== 1 ? 's' : ''}`);
  }

  if (hours && result.length < 3) {
    result.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }

  if (minutes && result.length < 3) {
    result.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }

  if (result.length < 3) {
    result.push(`${seconds ?? 0} second${seconds !== 1 ? 's' : ''}`);
  }

  return result.join(', ');
}

export function getDateArgs(passed: Date, current = new Date()): number[] {
  // Correct time by current timezone.
  const timezoneOffset = current.getTimezoneOffset() - passed.getTimezoneOffset();

  passed.setHours(passed.getHours() - timezoneOffset / 60);

  const greater = current >= passed ? current : passed;
  const lesser = current < passed ? current : passed;

  const difference = greater.getTime() - lesser.getTime();

  const seconds = Math.trunc(difference / 1000) % 60;
  const minutes = Math.trunc(difference / 1000 / 60) % 60;
  const hours = Math.trunc(difference / 1000 / 60 / 60) % 24;

  const daysOfMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  let days = Math.trunc(difference / 1000 / 60 / 60 / 24);
  let currMonth = greater.getMonth();
  let currYear = greater.getFullYear();

  let months = 0, years = 0;

  while (days >= daysOfMonth[currMonth]) {
    const isFebruary = currMonth === 1;
    const isLeapYear = currYear % 4 === 0;

    days -= daysOfMonth[currMonth] + (isFebruary && isLeapYear ? 1 : 0);

    if (++months === 12) {
      months = 0; ++years;
    }

    if (--currMonth < 0) {
      currMonth = 11; --currYear;
    }
  }

  return [years, months, days, hours, minutes, seconds];
}

export function calculateMaxLengthOfTable(values: string[][], borderLength = 3): number {
  let maxLength = 0;

  if (!values.length) return maxLength;

  for (let i = 0; i < values[0].length; ++i) {
    let currMax = 0;

    for (let j = 0; j < values.length; ++j) {
      currMax = Math.max(currMax, values[j][i].length);
    }

    maxLength += currMax;

    if (i + 1 !== values[0].length) {
      maxLength += borderLength;
    }
  }

  return maxLength;
}
